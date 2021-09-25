import { JsonRpcProvider } from '@ethersproject/providers';
import { TrustedForwarder__factory } from '@sdk/factories/TrustedForwarder__factory';
import getContract from './getContract';

const EXQUISITE_LAND_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string;

export const getDataToSignForEIP712 = async (request: any, chainId: number) => {
  const forwarderAddress = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS as string;
  const dataToSign = {
    domain: {
      name: 'Exquisite Land',
      version: '0.0.1',
      verifyingContract: forwarderAddress
    },
    types: {
      ForwardRequest: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'gas', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'data', type: 'bytes' }
      ]
    },
    primaryType: 'ForwardRequest',
    message: request
  };
  return dataToSign;
};

export const getSignatureForTypedData = async (
  provider: JsonRpcProvider,
  dataToSign: {
    domain: Record<string, string>;
    types: Record<string, { name: string; type: string }[]>;
    primaryType: string;
    message: any;
  }
) => {
  const signature = await provider
    .getSigner()
    ._signTypedData(dataToSign.domain, dataToSign.types, dataToSign.message);
  return signature;
};

export const createTile = async (
  x: number,
  y: number,
  pixels: string,
  account: string,
  chainID: number,
  jsonRpcProvider: JsonRpcProvider
) => {
  const contract = getContract(jsonRpcProvider);

  const { data } = await contract.populateTransaction['createTile'](
    x,
    y,
    pixels
  );

  const gasLimit = await contract.estimateGas['createTile'](x, y, pixels, {
    from: account
  });

  const gasLimitNum = Number(gasLimit.toNumber().toString());

  const forwarder = TrustedForwarder__factory.connect(
    process.env.NEXT_PUBLIC_FORWARDER_ADDRESS as string,
    jsonRpcProvider
  );

  const nonce = await forwarder.getNonce(account);

  const request = {
    from: account,
    to: EXQUISITE_LAND_CONTRACT_ADDRESS,
    value: 0,
    gas: gasLimitNum,
    nonce: nonce.toNumber(),
    data
  };
  const dataToSign = await getDataToSignForEIP712(request, chainID);
  return dataToSign;
};
