import {
  checkTokenIdIsOwnedByLandGranter,
  getTokenIDForCoin
} from '@server/LandGranter';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const { coinB64 }: { coinB64?: string } = req.body;

  if (!coinB64)
    return res.status(400).json({ error: 'Missing coin data or recipient.' });

  const { tokenId, coinCreator } = await getTokenIDForCoin(coinB64);
  if (tokenId == undefined)
    return res.status(400).json({ error: 'Invalid coin data.' });

  const isGrantable = await checkTokenIdIsOwnedByLandGranter(tokenId);
  if (!isGrantable)
    return res.status(400).json({ error: 'Coin has already been claimed.' });

  return res.json({ tokenId, coinCreator });
};

export default api;
