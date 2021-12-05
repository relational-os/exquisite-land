import prisma from 'lib/prisma';
import { getAllTiles } from '@app/features/Graph';
import { NextApiHandler } from 'next';
import { LAND_GRANTER_CONTRACT_ADDRESS } from '@app/features/AddressBook';
import { sendMessage } from '@server/Discord';

const api: NextApiHandler = async (_req, res) => {
  console.log('incoming refreshTiles request');
  const data = await getAllTiles();

  for (const tile of data) {
    console.log('procesing', tile);
    const foundTile = await prisma.tile.findUnique({
      where: {
        id: tile.id
      }
    });

    if (foundTile) {
      if (foundTile.status != tile.status) {
        await prisma.tile.update({
          data: {
            status: tile.status,
            svg: tile.svg
          },
          where: {
            id: tile.id
          }
        });
        console.log(`${tile.id}, updated`);
      }
    } else {
      await prisma.tile.create({
        data: {
          id: tile.id,
          discordSent: false,
          svg: tile.svg,
          x: parseInt(tile.x),
          y: parseInt(tile.y),
          status: tile.status,
          owner: tile.owner.address
        }
      });
      console.log(`${tile.id}, created`);
    }
  }

  let queuedNotifications = await prisma.tile.findMany({
    where: {
      discordSent: false,
      NOT: {
        owner: {
          in: [LAND_GRANTER_CONTRACT_ADDRESS]
        }
      }
    }
  });

  console.log(`${queuedNotifications.length} queued tile notifications`);

  // choose the first pending Tile, and send a notification for it
  if (queuedNotifications.length > 0) {
    let toDeliver = queuedNotifications[0];

    const pngUrl = `https://exquisite.land/api/tiles/terramasu/${toDeliver.x}/${toDeliver.y}/img?size=500`;

    let resolvedName;

    try {
      // TODO: get this directly through a function call
      let response = await fetch(
        `https://exquisite.land/api/ens-name?address=${toDeliver.owner}`
      );

      let json = await response.json();
      resolvedName = json.name;
    } catch (error) {
      console.log(error);
      console.log('failed to resolve ENS name, falling back to address');
      resolvedName = toDeliver.owner.slice(0, 6);
    }

    const message = `${resolvedName} minted tile [${toDeliver.x}, ${toDeliver.y}]`;
    console.log(
      `Sending tile notification for ${toDeliver.id} with image ${pngUrl} and message "${message}"`
    );

    try {
      await sendMessage('bot-testing', 'xqst', '', [
        {
          title: message,
          type: 'rich',
          image: {
            url: pngUrl
          }
        }
      ]).then((res) => {
        if (res == true) {
          prisma.tile
            .update({
              where: {
                id: toDeliver.id
              },
              data: {
                discordSent: true
              }
            })
            .then((r: any) => {
              console.log(r);
            });
        }
      });

      return res.json({ success: true });
    } catch (error) {
      console.log('error', error);
      return res.json({ success: false });
    }
  } else {
    console.log('no new tiles, finishing run');
    return res.json({ success: true });
  }
};

export default api;
