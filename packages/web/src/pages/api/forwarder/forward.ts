import { NextApiHandler } from 'next';
import { Wallet } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { TrustedForwarder__factory } from '@sdk/factories/TrustedForwarder__factory';
import { FORWARDER_CONTRACT_ADDRESS } from '@app/features/AddressBook';

// TODO: update with 5 keys
const PRIVATE_KEYS = [
  process.env.FORWARDER_PRIVATE_KEY_1 as string,
  process.env.FORWARDER_PRIVATE_KEY_2 as string,
  process.env.FORWARDER_PRIVATE_KEY_3 as string,
  process.env.FORWARDER_PRIVATE_KEY_4 as string,
  process.env.FORWARDER_PRIVATE_KEY_5 as string
];

const api: NextApiHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type');
  if (req.method == 'POST') {
    const {
      data,
      signature
    }: {
      data: any;
      signature: string;
    } = req.body;

    const privateKey =
      PRIVATE_KEYS[
        parseInt(data.message.from.slice(-2), 16) % PRIVATE_KEYS.length
      ];

    const wallet = new Wallet(
      privateKey,
      new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    );

    const forwarder = TrustedForwarder__factory.connect(
      FORWARDER_CONTRACT_ADDRESS,
      wallet
    );
    const nonce = await wallet.getTransactionCount();
    const tx = await forwarder.execute(data.message, signature, {
      gasLimit: Math.floor(data.message.gas * 2.5),
      nonce
    });
    return res.json(tx);
  } else {
    res.send('');
  }
};

export default api;
