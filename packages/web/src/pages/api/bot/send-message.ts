import { NextApiHandler } from 'next';
import { sendMessage } from '@server/Discord';
import { verifyMessage } from '@ethersproject/wallet';
import { ADMIN_ADDRESSES } from '@app/features/AddressBook';

const SIGNING_MESSAGE = 'I am me.';

const api: NextApiHandler = async (_req, res) => {
  const {
    signature,
    account,
    as,
    channel,
    content
  }: {
    signature: string;
    account: string;
    as: string;
    channel: string;
    content: string;
  } = _req.body;
  const signingAccount = verifyMessage(SIGNING_MESSAGE, signature);

  if (account.toLowerCase() != signingAccount.toLowerCase())
    return res.status(400).json({ error: 'Invalid signature' });

  if (!ADMIN_ADDRESSES.includes(account.toLowerCase())) {
    return res.status(400).json({ error: 'not authorized' });
  }

  await sendMessage(channel, as, content);

  return res.json({ success: true });
};
export default api;
