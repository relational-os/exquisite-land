import { JsonRpcProvider } from '@ethersproject/providers';

const getJsonRpcProvider = () => {
  return new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string);
};

export const getEthJsonRpcProvider = () => {
  return new JsonRpcProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL as string);
};

export const ethJsonRpcProvider = getEthJsonRpcProvider();

export const ethJsonRpcProvider = new providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
);

export default getJsonRpcProvider;
