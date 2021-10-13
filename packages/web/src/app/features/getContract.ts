import { ExquisiteLand__factory } from '@sdk/factories/ExquisiteLand__factory';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { EXQUISITE_LAND_CONTRACT_ADDRESS } from './AddressBook';

const getContract = (provider: JsonRpcProvider | Signer) => {
  return ExquisiteLand__factory.connect(
    EXQUISITE_LAND_CONTRACT_ADDRESS,
    provider
  );
};

export default getContract;
