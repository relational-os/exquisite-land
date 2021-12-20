import { NextApiHandler } from 'next';
import { getNextTiles } from '@server/Gorblin';
import prisma from 'lib/prisma';

const api: NextApiHandler = async (req, res) => {
  const tiles = await getNextTiles();

  if (!tiles) {
    return res.json({ error: 'No tiles found' });
  }

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];

    const found = await prisma.gorblinGiveaway.findUnique({
      where: {
        tokenId: parseInt(tile.id)
      }
    });

    if (!found) {
      await prisma.gorblinGiveaway.create({
        data: {
          tokenId: parseInt(tile.id),
          recirculated: false,
          // @ts-ignore
          x: parseInt(tile.x),
          y: parseInt(tile.y)
        }
      });
    }
  }

  return res.json({ test: true });

  // return res.json({ giveaways });
  // tiles.forEach(async (tile: any) => {
  //   console.log('tile', tile.id);

  //     return res.json({ inserted: true });
  //   }
  // });

  // const giveaways = await prisma.gorblinGiveaway.findMany({
  //   where: {
  //     // @ts-ignore
  //     completed: false
  //   },
  //   take: 5,
  //   orderBy: { createdAt: 'asc' }
  // });
  // return res.json({ giveaways });
};

export default api;
