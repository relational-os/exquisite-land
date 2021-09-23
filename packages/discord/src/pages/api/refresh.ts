import prisma from '@server/helpers/prisma';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const toRefresh = await prisma.user.findMany({
    where: {
      lastChecked: { lte: new Date(Date.now() - 1000 * 60 * 5) }
    }
  });
  for (const user of toRefresh) {
  }
  return res.json({});
};

export default api;
