import prisma from '@server/helpers/prisma';
import { getAllTiles } from '@server/services/Graph';
import { NextApiHandler } from 'next';
import { sendMessageWithImage } from '@server/bot';
import {
  DISCORD_CHANNELS,
  LAND_GRANTER_CONTRACT_ADDRESS
} from '@app/features/AddressBook';

const api: NextApiHandler = async (_req, res) => {
  const data = await getAllTiles();

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

    console.log(
      `Sending tile notification for ${toDeliver.id} with image ${pngUrl}`
    );
    let apiResponse = await sendMessageWithImage(
      channelId,
      `a tile is minted: ${toDeliver.id}`,
      pngUrl
    );

    console.log({ apiResponse });

    // TODO: improve discord API response error handling
    if (apiResponse.id) {
      // @ts-ignore
      await prisma.tile.update({
        where: {
          id: toDeliver.id
        },
        data: {
          discordSent: true
        }
      });
      return res.json({ success: true });
    } else {
      console.log('discord api error', apiResponse);
      return res.json({ success: false });
    }
  } else {
    return res.json({ success: false });
  }
};

export default api;
