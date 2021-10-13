import {
  checkTokenIdIsOwnedByLandGranter,
  grantLandTile
} from '@server/LandGranter';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const { tokenId, recipient }: { tokenId?: number; recipient?: string } =
    req.body;

  if (!tokenId || !recipient)
    return res.status(400).json({ error: 'Missing coin data or recipient.' });

  const isGrantable = await checkTokenIdIsOwnedByLandGranter(tokenId);
  if (!isGrantable)
    return res.status(400).json({ error: 'Coin has already been claimed.' });

  const tx = await grantLandTile(tokenId, recipient);
  const reciept = await tx.wait(1);
  return res.json({ tx: reciept.transactionHash });
};

export default api;
