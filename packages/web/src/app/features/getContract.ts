import { JsonRpcProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { EXQUISITE_LAND_CONTRACT_ADDRESS } from './AddressBook';
import { TerraMasu__factory } from '@sdk/factories/TerraMasu__factory';

const getContract = (provider: JsonRpcProvider | Signer) => {
  return TerraMasu__factory.connect(EXQUISITE_LAND_CONTRACT_ADDRESS, provider);
};

export default getContract;
