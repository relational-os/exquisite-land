import { verifyMessage } from '@ethersproject/wallet';
import { NextApiHandler } from 'next';
import { sendMessage } from '@server/Discord';

const SIGNING_MESSAGE =
  'I HEREBY INVITE THE GORBLIN IN AND ASSUME ALL RESPONSIBILITY FOR ANY SLIMINGS';

const api: NextApiHandler = async (req, res) => {
  if (req.method == 'POST') {
    const { signature, account }: { signature: string; account: string } =
      req.body;
    const signingAccount = verifyMessage(SIGNING_MESSAGE, signature);
    console.log({ signature });
    console.log({ account });

    if (account.toLowerCase() != signingAccount.toLowerCase())
      return res.status(400).json({ error: 'Invalid signature' });

    console.log(`signature matches! signed by ${account}`);

    let introMessage = `sup I'ma coin y'alls asses`;
    await sendMessage('bot-testing', 'gorblin', introMessage);

    const message = `${account} completed signature and gorblin invitiation flow`;
    await sendMessage('admin-chat', 'xqst', message);

    return res.json({ success: true });
  }
};

export default api;
