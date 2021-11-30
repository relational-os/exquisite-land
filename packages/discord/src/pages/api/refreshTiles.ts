import prisma from '@server/helpers/prisma';
import { getAllTiles } from '@server/services/Graph';
import { NextApiHandler } from 'next';
import { sendMessageWithImage } from '@server/bot';
import {
  DISCORD_CHANNELS,
  LAND_GRANTER_CONTRACT_ADDRESS
} from '@app/features/AddressBook';
import { getENSName } from '@app/features/useENSorAddress';

const api: NextApiHandler = async (_req, res) => {
  console.log('incoming refreshTiles request');
  const data = await getAllTiles();
  console.log({ data });

  for (const tile of data?.tiles) {
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

  // choose the first pending Tile, and send a notification for it
  if (queuedNotifications.length > 0) {
    let toDeliver = queuedNotifications[0];
    let channelId = DISCORD_CHANNELS['terra-masu'];

    const pngUrl = `https://exquisite.land/api/tiles/terramasu/${toDeliver.x}/${toDeliver.y}/img?size=500`;

    // const resolvedName =

    let message;
    // if (resolvedName && false) {
    //   message = `${resolvedName} minted tile [${toDeliver.x}, ${toDeliver.y}]`;
    // } else {
    message = `${toDeliver.owner.slice(-6)} minted tile [${toDeliver.x}, ${
      toDeliver.y
    }]`;
    // }
    console.log({ message });

    console.log(
      `Sending tile notification for ${toDeliver.id} with image ${pngUrl}`
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
