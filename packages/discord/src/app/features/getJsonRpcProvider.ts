import { providers } from 'ethers';

const getJsonRpcProvider = (network: string): providers.Provider =>
  network == 'mumbai'
    ? new providers.JsonRpcProvider(
        `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
      )
    : new providers.JsonRpcProvider(
        `https://${network}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
      );

export default getJsonRpcProvider;
