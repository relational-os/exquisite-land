import { NextApiHandler } from 'next';
import { Wallet } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { TrustedForwarder__factory } from '@sdk/factories/TrustedForwarder__factory';
import { FORWARDER_CONTRACT_ADDRESS } from '@app/features/AddressBook';

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
    const wallet = new Wallet(
      process.env.CONTRACT_OWNER_PRIVATE_KEY as string,
      new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    );
    const forwarder = TrustedForwarder__factory.connect(
      FORWARDER_CONTRACT_ADDRESS,
      wallet
    );
    const tx = await forwarder.execute(data.message, signature, {
      gasLimit: Math.floor(data.message.gas * 2.5)
    });
    return res.json(tx);
  } else {
    res.send('');
  }
};

export default api;
