import { getNextTile } from '@server/Gorblin';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const tile = await getNextTile();
  return res.json({ tile });
};

export default api;
