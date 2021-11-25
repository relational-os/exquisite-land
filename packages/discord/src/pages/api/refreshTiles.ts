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
  const data = await getAllTiles();

  // @ts-ignore
  // await prisma.tile.updateMany({
  //   where: {
  //     discordSent: false
  //   },
  //   data: {
  //     discordSent: true
  //   }
  // });

  for (const tile of data?.tiles) {
    // @ts-ignore
    const foundTile = await prisma.tile.findUnique({
      where: {
        id: tile.id
      }
    });

    if (foundTile) {
      // @ts-ignore
      await prisma.tile.update({
        data: {
          // @ts-ignore
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
          // @ts-ignore
          svg: tile.svg,
          x: parseInt(tile.x),
          y: parseInt(tile.y),
          status: tile.status,
          owner: tile.owner.address
        }
      });
    }
  }

  // @ts-ignore
  let queuedNotifications = await prisma.tile.findMany({
    where: {
      discordSent: false,
      NOT: {
        // @ts-ignore
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

    const resolvedName = await getENSName(toDeliver.owner);

    let message;
    if (resolvedName) {
      message = `${resolvedName} minted tile [${toDeliver.x}, ${toDeliver.y}]`;
    } else {
      message = `${toDeliver.owner.slice(-6)} minted tile [${toDeliver.x}, ${
        toDeliver.y
      }]`;
    }
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
    return res.json({ success: true });
  }
};

export default api;
