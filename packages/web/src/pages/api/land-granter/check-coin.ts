import {
  checkTokenIdIsOwnedByLandGranter,
  getTokenIDForCoin,
  grantLandTile
} from '@server/LandGranter';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const { coinB64, recipient }: { coinB64?: string; recipient?: string } =
    req.body;

  if (!coinB64 || !recipient)
    return res.status(400).json('Missing coin data or recipient.');

  const tokenId = await getTokenIDForCoin(coinB64);
  if (tokenId == null) return res.status(400).json('Invalid coin data.');

  const isGrantable = await checkTokenIdIsOwnedByLandGranter(tokenId);
  if (!isGrantable)
    return res.status(400).json('Coin has already been claimed.');

  const tx = await grantLandTile(tokenId, recipient);
  const reciept = await tx.wait(1);
  return res.json({ success: true, tx: reciept.transactionHash });
};

export default api;
