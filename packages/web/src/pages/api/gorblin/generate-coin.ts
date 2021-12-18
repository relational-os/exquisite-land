import { ADMIN_ADDRESSES } from '@app/features/AddressBook';
import { verifyMessage } from '@ethersproject/wallet';
import { NextApiHandler } from 'next';
import { generateGorblinCoin } from '@server/GenerateGorblin';
import { getTile } from '@app/features/useTile';
import prisma from 'lib/prisma';

const api: NextApiHandler = async (req, res) => {
  const {
    signature,
    account,
    tokenId
  }: {
    signature: string;
    account: string;
    tokenId: string;
  } = req.body;

  if (req.method == 'POST') {
    const signingAccount = verifyMessage('I am me.', signature);

    if (!ADMIN_ADDRESSES.includes(signingAccount.toLowerCase())) {
      return res.status(400).json({ error: 'not authorized' });
    }

    if (account.toLowerCase() != signingAccount.toLowerCase())
      return res.status(400).json({ error: 'Invalid signature' });

    console.log(tokenId);
    const tile = await getTile(parseInt(tokenId));
    const giveaway = await prisma.gorblinGiveaway.findUnique({
      where: {
        tokenId: parseInt(tokenId)
      }
    });

    if (!giveaway || !tile) return res.json({ error: 'no tile / giveaway' });
    if (!giveaway.winner)
      return res.json({ error: 'no winner on giveaway object' });
    console.log('giveaway', giveaway);
    console.log('tile', tile);

    const gorblinCoinBuffer = await generateGorblinCoin(
      tokenId,
      tile.x,
      tile.y,
      signature,
      giveaway.winner
    );

    if (gorblinCoinBuffer instanceof Error) {
      console.log(gorblinCoinBuffer);
      return res.status(400).json({ error: 'Error generating coin' });
    }

    return res.json({
      coinImage: gorblinCoinBuffer.toString('base64')
    });
  }
};

export default api;
