import { NextApiHandler } from 'next';
import prisma from 'lib/prisma';
import { ADMIN_ADDRESSES } from '@app/features/AddressBook';
import { verifyMessage } from '@ethersproject/wallet';

const api: NextApiHandler = async (req, res) => {
  if (req.method != 'POST') return;
  const {
    signature,
    account,
    giveawayId
  }: {
    signature: string;
    account: string;
    giveawayId: number;
  } = req.body;

  if (req.method == 'POST') {
    const signingAccount = verifyMessage('I am me.', signature);

    if (!ADMIN_ADDRESSES.includes(signingAccount.toLowerCase())) {
      return res.status(400).json({ error: 'not authorized' });
    }

    if (account.toLowerCase() != signingAccount.toLowerCase())
      return res.status(400).json({ error: 'Invalid signature' });

    const updatedGiveaway = await prisma.gorblinGiveaway.update({
      where: {
        id: giveawayId
      },
      data: {
        // @ts-ignore
        completed: true
      }
    });
    return res.json({ updatedGiveaway });
  }
};

export default api;
