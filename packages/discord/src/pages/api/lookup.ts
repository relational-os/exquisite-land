import prisma from '@server/helpers/prisma';
import { NextApiHandler } from 'next';
// import NextCors from 'nextjs-cors';

const api: NextApiHandler = async (req, res) => {
  console.log(req.query);
  //   await NextCors(req, res, {
  //     methods: ['GET'],
  //     origin: '*',
  //     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  //   });

  const user = await prisma.user.findFirst({
    where: { address: req.query.address as string },
    select: {
      discordId: true,
      address: true
    }
  });
  if (!user) return res.status(404).end();

  return res.json({
    address: user.address,
    id: user.discordId
  });
};

export default api;
