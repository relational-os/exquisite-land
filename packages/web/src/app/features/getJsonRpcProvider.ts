import { JsonRpcProvider } from '@ethersproject/providers';

const getJsonRpcProvider = () => {
  return new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string);
};

export default getJsonRpcProvider;
