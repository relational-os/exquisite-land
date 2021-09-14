import { ExquisiteLand__factory } from '@sdk/factories/ExquisiteLand__factory';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';

const getContract = (provider: JsonRpcProvider | Signer) => {
  return ExquisiteLand__factory.connect(
    process.env.NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string,
    provider
  );
};

export default getContract;
