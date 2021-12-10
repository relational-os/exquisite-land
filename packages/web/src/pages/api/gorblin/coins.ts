import { NextApiHandler } from 'next';
import prisma from 'lib/prisma';

const api: NextApiHandler = async (req, res) => {
  const coins = await prisma.gorblinCoin.findMany({});
  return res.json({ coins });
};

export default api;
