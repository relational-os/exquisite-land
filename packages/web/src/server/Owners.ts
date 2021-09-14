import getJsonRpcProvider from '@app/features/getJsonRpcProvider';
import { verifyMessage } from '@ethersproject/wallet';
import { Tile__factory } from '@sdk/factories/Tile__factory';

export const getOwnerAddress = () => {
  const contract = Tile__factory.connect(
    process.env.NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string,
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
