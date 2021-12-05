import {
  checkTokenIdIsOwnedByLandGranter,
  getTokenIDForCoin
} from '@server/LandGranter';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const { coinB64, recipient }: { coinB64?: string; recipient?: string } =
    req.body;

  if (!coinB64 || !recipient)
    return res.status(400).json({ error: 'Missing coin data or recipient.' });

  const { tokenId, coinCreator, claimer } = await getTokenIDForCoin(coinB64);

  console.log(claimer);
  console.log(recipient);

  if (claimer && claimer.toLowerCase() != recipient.toLowerCase())
    return res.status(400).json({ error: 'You cannot claim this coin.' });

  if (tokenId == undefined)
    return res.status(400).json({ error: 'Invalid coin data.' });

  const isGrantable = await checkTokenIdIsOwnedByLandGranter(tokenId);
  if (!isGrantable)
    return res.status(400).json({ error: 'Coin has already been claimed.' });

  return res.json({ tokenId, coinCreator, claimer });
};

export default api;
