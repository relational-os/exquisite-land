import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const { signature }: { signature: string } = req.body;
  // TODO: Verify signature

  // TODO: Post request to Discord-side API.

  return res.json({});
};

export default api;
