import { EXQUISITE_LAND_CONTRACT_ADDRESS } from '@app/features/AddressBook';
import getJsonRpcProvider from '@app/features/getJsonRpcProvider';
import { verifyMessage } from '@ethersproject/wallet';
import { ExquisiteLand__factory } from '@sdk/factories/ExquisiteLand__factory';

export const getOwnerAddress = () => {
  const contract = ExquisiteLand__factory.connect(
    EXQUISITE_LAND_CONTRACT_ADDRESS,
    getJsonRpcProvider()
  );
  return contract.owner();
};

export const OWNER_SIGNATURE_MESSAGE =
  'Sign to confirm you are the owner of the Exquisite Land contract.';

export const checkOwnerSignature = async (
  message: string,
  signature: string
) => {
  const ownerAddress = await getOwnerAddress();
  const signerAddress = verifyMessage(message, signature);
  return ownerAddress.toLowerCase() == signerAddress.toLowerCase();
};
