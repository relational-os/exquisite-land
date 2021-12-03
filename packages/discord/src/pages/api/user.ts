import prisma from '@server/helpers/prisma';
import { createLinkAddressMessage } from '@server/signedMessages';
import { NextApiHandler } from 'next';
import NextCors from 'nextjs-cors';

const api: NextApiHandler = async (req, res) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const user = await prisma.user.findUnique({
    where: { id: req.query.id as string },
    select: {
      id: true,
      discordId: true,
      discordUsername: true,
      discordDiscriminator: true,
      discordAvatar: true,
      address: true
    }
  });
  if (!user) return res.status(404).end();

  return res.json({
    user,
    linkAddressMessage: createLinkAddressMessage(user.id)
  });
};

export default api;
