import { verifyMessage } from '@ethersproject/wallet';
import { NextApiHandler } from 'next';

const SIGNING_MESSAGE = 'I am me.';

const api: NextApiHandler = async (req, res) => {
  const { signature, account }: { signature: string; account: string } =
    req.body;
  const signingAccount = verifyMessage(SIGNING_MESSAGE, signature);

  if (account.toLowerCase() != signingAccount.toLowerCase())
    return res.status(400).json({ error: 'Invalid signature' });

  return res.json({ success: true });
};

export default api;
