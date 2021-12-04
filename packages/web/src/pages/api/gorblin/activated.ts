import { NextApiHandler } from 'next';
import prisma from 'lib/prisma';

const api: NextApiHandler = async (req, res) => {
  let gorblinExists = await prisma.gorblin.findMany({
    orderBy: [
      {
        createdAt: 'asc'
      }
    ]
  });
  res.setHeader('Cache-Control', 'public, s-max-age=15');
  return res.json({
    gorblinExists: gorblinExists.length > 0,
    createdAt: gorblinExists?.[0]?.createdAt
  });
};

export default api;
