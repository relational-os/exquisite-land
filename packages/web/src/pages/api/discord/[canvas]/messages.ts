import { getMessagesForChannelName } from '@server/Discord';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const channel = req.query.canvas as string;
  const messages = await getMessagesForChannelName(channel);

  return res.json(messages);
};

export default api;
