import { generateCoin } from '@server/LandGranter';
import { checkOwnerSignature, OWNER_SIGNATURE_MESSAGE } from '@server/Owners';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const { tokenId, signature }: { tokenId?: string; signature?: string } =
    req.query;
  if (!tokenId || isNaN(parseInt(tokenId)) || !signature)
    return res.status(400).json('Missing tokenId or signature.');

  if (!(await checkOwnerSignature(OWNER_SIGNATURE_MESSAGE, signature)))
    return res.status(403).json('Invalid signature.');

  const coinImage = await generateCoin(parseInt(tokenId));

  res.setHeader('Content-Type', 'image/png');
  return res.send(coinImage);
};

export default api;
