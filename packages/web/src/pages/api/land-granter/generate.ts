import {
  checkTokenIdIsOwnedByLandGranter,
  generateCoin
} from '@server/LandGranter';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  // const { tokenId, signature }: { tokenId?: string; signature?: string } =
  //   req.query;
  // if (!tokenId || isNaN(parseInt(tokenId)) || !signature)
  // return res.status(400).json('Missing tokenId or signature.');
  // if (!(await checkOwnerSignature(OWNER_SIGNATURE_MESSAGE, signature)))
  //   return res.status(403).json('Invalid signature.');

  const { tokenId }: { tokenId?: string } = req.query;
  if (!tokenId || isNaN(parseInt(tokenId)))
    return res.status(400).json({ error: 'Missing tokenId.' });

  const isGrantable = await checkTokenIdIsOwnedByLandGranter(parseInt(tokenId));
  if (!isGrantable)
    return res
      .status(400)
      .json({ error: 'Coin not generatable for this tile.' });

  const coinImage = await generateCoin(parseInt(tokenId));
  res.setHeader('Content-Type', 'image/png');
  return res.send(coinImage);
};

export default api;
