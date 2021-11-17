import prisma from '@server/helpers/prisma';
import { getAllTiles } from '@server/services/Graph';
import { NextApiHandler } from 'next';
import { sendMessageWithImage } from '@server/bot';
import { CommandInteractionOptionResolver } from 'discord.js';

const api: NextApiHandler = async (_req, res) => {
  const data = await getAllTiles();

  for (const tile of data?.tiles) {
    const foundTile = await prisma.tile.findUnique({
      where: {
        id: tile.id
      }
    });

    // TODO: replace with more efficient find/create loop
    if (foundTile) {
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
  const LAND_GRANTER = '0xa354dd8d9e114154bd79b42f28b2e2b23a078926';
  // const COIN_CREATOR = '0xD286064cc27514B914BAB0F2FaD2E1a89A91F314';

  // @ts-ignore
  let queuedNotifications = await prisma.tile.findMany({
    where: {
      discordSent: false,
      NOT: {
        // @ts-ignore
        owner: {
          in: [LAND_GRANTER]
        }
      }
    }
  });
  console.log({ count: queuedNotifications.length });
  console.log({ queuedNotifications });

  // choose the first pending Tile, and send a notification for it
  if (queuedNotifications.length > 0) {
    let toDeliver = queuedNotifications[0];

    const pngUrl = `https://exquisite.land/api/tiles/terramasu/${toDeliver.x}/${toDeliver.y}/img?size=500`;
    // const pngUrl = `http://localhost:3001/api/tiles/terramasu/${toDeliver.x}/${toDeliver.y}/image?size=500`;

    console.log(
      `Sending tile notification for ${toDeliver.id} with image ${pngUrl}`
    );
    let res = sendMessageWithImage(`a tile is minted: ${toDeliver.id}`, pngUrl);
    console.log({ res });

    if (res.statusCode === 200) {
      // @ts-ignore
      await prisma.tile.update({
        where: {
          id: toDeliver.id
        },
        data: {
          discordSent: true
        }
      });
    }
  }

  return res.json({ success: true });
};

export default api;
