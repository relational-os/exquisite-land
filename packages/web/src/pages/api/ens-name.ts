import { getEthJsonRpcProvider } from '@app/features/getJsonRpcProvider';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const provider = getEthJsonRpcProvider;
  const name = await provider.lookupAddress(req.query.address as string);
  res.setHeader('Cache-Control', 's-maxage=2500000, stale-while-revalidate');
  return res.json({ name: name ? name : req.query.address.slice(0, 6) });
};

export default api;
