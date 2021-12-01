import prisma from '@server/helpers/prisma';
import { getAllTiles } from '@server/services/Graph';
import { NextApiHandler } from 'next';
import { sendMessageWithImage } from '@server/bot';
import {
  DISCORD_CHANNELS,
  LAND_GRANTER_CONTRACT_ADDRESS
} from '@app/features/AddressBook';

const api: NextApiHandler = async (_req, res) => {
  console.log('incoming refreshTiles request');
  const data = await getAllTiles();

  for (const tile of data) {
    const foundTile = await prisma.tile.findUnique({
      where: {
        id: tile.id
      }
    });

    if (foundTile) {
      await prisma.tile.update({
        data: {
          status: tile.status,
          svg: tile.svg
        },
        where: {
          id: tile.id
        }
      });
    } else {
      // @ts-ignore
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
    let channelId = DISCORD_CHANNELS['terra-masu'];

    const pngUrl = `https://exquisite.land/api/tiles/terramasu/${toDeliver.x}/${toDeliver.y}/img?size=500`;

    let resolvedName;

    try {
      let response = await fetch(
        `https://exquisite.land/api/ens-name?address=${toDeliver.owner}`
      );

      let json = await response.json();
      console.log({ json });
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
      await sendMessageWithImage(channelId, message, pngUrl);
      // update our db object with success state
      await prisma.tile.update({
        where: {
          id: toDeliver.id
        },
        data: {
          discordSent: true
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
