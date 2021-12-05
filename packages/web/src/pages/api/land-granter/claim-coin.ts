import {
  checkTokenIdIsOwnedByLandGranter,
  grantLandTile
} from '@server/LandGranter';
import prisma from 'lib/prisma';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const {
    tokenId,
    recipient,
    coinCreator
  }: { tokenId?: number; recipient?: string; coinCreator?: string } = req.body;

  if (tokenId == undefined || !recipient || !coinCreator)
    return res
      .status(400)
      .json({ error: 'Missing coin data, recipient, or creator.' });

  const isGrantable = await checkTokenIdIsOwnedByLandGranter(tokenId);
  if (!isGrantable)
    return res.status(400).json({ error: 'Coin has already been claimed.' });

  // if token is in the gorblin table, make sure that the recipient is the one found in the DB
  const gorblinCoin = await prisma.gorblinCoin.findFirst({
    where: {
      tokenID: tokenId
    }
  });

  if (gorblinCoin) {
    if (recipient.toLowerCase() != gorblinCoin.claimer.toLowerCase()) {
      return res
        .status(400)
        .json({ error: 'Recipient does not match gorblin recipient.' });
    }
  }

  console.log(
    `Granting land tile ${tokenId} to ${recipient} with coinCreator ${coinCreator}`
  );

  try {
    const tx = await grantLandTile(tokenId, recipient, coinCreator);
    console.log('tx hash', tx.hash, tx.gasPrice, tx.nonce);
    const reciept = await tx.wait(2);
    return res.json({ tx: reciept.transactionHash });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: "You can't be your own neighbor.\nInvite a friend!" });
  }
};

export default api;
