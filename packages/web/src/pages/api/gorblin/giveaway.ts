import { NextApiHandler } from 'next';
import prisma from 'lib/prisma';

const api: NextApiHandler = async (req, res) => {
  const giveaways = await prisma.gorblinGiveaway.findMany({
    where: {
      // @ts-ignore
      completed: false
    },
    take: 5,
    orderBy: { id: 'asc' }
  });
  return res.json({ giveaways });
};

export default api;
