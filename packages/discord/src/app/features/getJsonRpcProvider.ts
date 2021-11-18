import { JsonRpcProvider } from '@ethersproject/providers';

export const getEthJsonRpcProvider = new JsonRpcProvider(
  process.env.NEXT_PUBLIC_ETH_RPC_URL as string
);
export const getJsonRpcProvider = new JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL as string
);
