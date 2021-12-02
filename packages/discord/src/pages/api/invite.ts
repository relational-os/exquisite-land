import { verifyMessage } from '@ethersproject/wallet';
import prisma from '@server/helpers/prisma';
import { NextApiHandler } from 'next';

const SIGNING_MESSAGE =
  'I HEREBY INVITE THE GORBLIN IN AND ASSUME ALL RESPONSIBILITY FOR ANY SLIMINGS';

const api: NextApiHandler = async (req, res) => {
  const { signature, account }: { signature: string; account: string } =
    req.body;
  const signingAccount = verifyMessage(SIGNING_MESSAGE, signature);
  console.log({ signature });
  console.log({ account });

  if (account.toLowerCase() != signingAccount.toLowerCase())
    return res.status(400).json({ error: 'Invalid signature' });

  console.log(`signature matches! signed by ${account}`);

  let introMessage = `sup I'ma coin y'alls asses. Thanks for the invite, ${account}`;

  fetch(`${process.env.HOST}/api/message`, {
    method: 'POST',
    body: JSON.stringify({ content: introMessage }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json());

  await prisma.gorblinInviter.create({
    data: { address: account }
  });

  return res.json({ success: true });
};

export default api;
