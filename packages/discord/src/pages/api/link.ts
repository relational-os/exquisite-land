import prisma from '@server/helpers/prisma';
import { refreshRoles } from '@server/services/Roles';
import { NextApiHandler } from 'next';
import { verifyLinkAddressMessage } from '@server/signedMessages';
import NextCors from 'nextjs-cors';

const api: NextApiHandler = async (req, res) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const {
    message,
    signature,
    account
  }: { message: string; signature: string; account: string } = req.body;

  const { userId } = verifyLinkAddressMessage(message, signature, account);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { address: account.toLowerCase() }
  });

  await refreshRoles(user);

  return await fetch(process.env.XQST_TERRA_MASU!, {
    method: 'POST',
    body: JSON.stringify({
      content: `<@${user.discordId}> has unlocked a special role!`
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    // responsds with a 204 on happy state
    return res.status == 204;
  });

  return res.json({ success: true });
};

export default api;
