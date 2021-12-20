import { NextApiHandler } from 'next';
import prisma from 'lib/prisma';
import { verifyMessage } from '@ethersproject/wallet';
import { ADMIN_ADDRESSES } from '@app/features/AddressBook';

const api: NextApiHandler = async (req, res) => {
  const {
    signature,
    account
  }: {
    signature: string;
    account: string;
  } = req.body;

  if (req.method == 'POST') {
    const signingAccount = verifyMessage('I am me.', signature);

    if (!ADMIN_ADDRESSES.includes(signingAccount.toLowerCase())) {
      return res.status(400).json({ error: 'not authorized' });
    }

    if (account.toLowerCase() != signingAccount.toLowerCase())
      return res.status(400).json({ error: 'Invalid signature' });
  }

  if (req.method == 'POST') {
    const { tokenId, discordMessageId } = req.body;
    console.log(tokenId, discordMessageId);
    await prisma.gorblinGiveaway.update({
      where: {
        tokenId: tokenId
      },
      data: {
        discordMessageId: discordMessageId
      }
    });
    return res.json(
      await prisma.gorblinGiveaway.findUnique({
        where: {
          tokenId: tokenId
        }
      })
    );
  }
};

export default api;
