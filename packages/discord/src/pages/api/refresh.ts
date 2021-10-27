import prisma from '@server/helpers/prisma';
import { refreshRoles } from '@server/services/Roles';
import { getAllTiles } from '@server/services/Graph';
import { NextApiHandler } from 'next';
import { sendMessage } from '@server/bot';

const api: NextApiHandler = async (_req, res) => {
  const usersToRefresh = await prisma.user.findMany({
    where: {
      lastChecked: { lte: new Date(Date.now() - 1000 * 60 * 3) }
    },
    orderBy: { lastChecked: 'asc' }
  });
  for (const user of usersToRefresh) {
    await refreshRoles(user);
  }

  const data = await getAllTiles().then((value) => value);

  for (const tile of data?.tiles) {
    // @ts-ignore
    const dbTile = await prisma.tile.findUnique({
      where: {
        id: tile.id
      }
    });

    // TODO: replace with more efficient find/create loop
    if (dbTile) {
      // console.log('found', dbTile);
    } else {
      // @ts-ignore
      await prisma.tile.create({
        data: {
          id: tile.id,
          discordSent: false
        }
      });
      console.log('created tile object');
    }
  }
  // TODO: break out into separate functions

  // @ts-ignore
  let queuedNotifications = await prisma.tile.findMany({
    where: {
      discordSent: false
    }
  });

  // choose the first Tile, and send a notification for it
  if (queuedNotifications.length > 0) {
    let toDeliver = queuedNotifications[0];

    // @ts-ignore
    await prisma.tile.update({
      where: {
        id: toDeliver.id
      },
      data: {
        discordSent: true
      }
    });
    sendMessage(`New Tile Created: ${toDeliver.id}`);
  }

  return res.json({ success: true });
};

export default api;
