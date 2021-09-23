import { verifyMessage } from '@ethersproject/wallet';
import prisma from '@server/helpers/prisma';
import { NextApiHandler } from 'next';
import { SIGNING_MESSAGE } from '../link';

const api: NextApiHandler = async (req, res) => {
  const {
    signature,
    account,
    id
  }: { signature: string; account: string; id: string } = req.body;
  const signingAccount = verifyMessage(SIGNING_MESSAGE, signature);

  if (account.toLowerCase() != signingAccount.toLowerCase())
    return res.status(400).json({ error: 'Invalid signature' });

  await prisma.user.update({
    where: { id },
    data: { address: account.toLowerCase() }
  });
  return res.json({ success: true });
};

export default api;
