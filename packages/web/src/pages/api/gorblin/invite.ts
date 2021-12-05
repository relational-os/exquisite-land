import { verifyMessage } from '@ethersproject/wallet';
import { NextApiHandler } from 'next';
import { sendMessage } from '@server/Discord';
import prisma from 'lib/prisma';

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

    let introMessage = `you’ve 72 hrs ’til I abuse my powers\nplenty o' time to prepare for me slime\ngreen tiles growing landless smiles`;
    await sendMessage('terra-masu', 'gorblin', introMessage);

    const message = `${account} completed signature and gorblin invitiation flow`;
    await sendMessage('admin-chat', 'xqst', message);

    await prisma.gorblin.create({
      data: {
        address: account
      }
    });

    return res.json({ success: true });
  }
};

export default api;
