import { getNextTiles } from '@server/Gorblin';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const tiles = await getNextTiles();
  return res.json({ tiles });
};

export default api;
