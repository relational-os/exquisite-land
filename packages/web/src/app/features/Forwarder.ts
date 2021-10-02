import { JsonRpcProvider } from '@ethersproject/providers';
import { TrustedForwarder__factory } from '@sdk/factories/TrustedForwarder__factory';
import getContract from './getContract';
import getJsonRpcProvider from './getJsonRpcProvider';

const EXQUISITE_LAND_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string;

const FORWARDER_API_URL = '/api/forwarder/forward';

export type TypedData = {
  domain: { name: string; version: string; verifyingContract: string };
  types: { ForwardRequest: { name: string; type: string }[] };
  primaryType: string;
  message: {
    data: string;
    from: string;
    to: string;
    gas: number;
    nonce: number;
    value: number;
  };
};

export const getDataToSignForEIP712 = (request: any): TypedData => {
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

// API Function
export const submitTx = async (dataToSign: TypedData, signature: string) => {
  const response = await fetch(FORWARDER_API_URL, {
    method: 'POST',
    body: JSON.stringify({ data: dataToSign, signature }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
  return await getJsonRpcProvider().getTransaction(response.transactionHash);
};

// CONTRACT FUNCTIONS
export const createTile = async (
  x: number,
  y: number,
  pixels: string,
  account: string,
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
  const dataToSign = getDataToSignForEIP712(request);
  return dataToSign;
};

export const inviteNeighbor = async (
  tokenId: number,
  inviteX: number,
  inviteY: number,
  recipient: string,
  account: string,
  jsonRpcProvider: JsonRpcProvider
) => {
  const contract = getContract(jsonRpcProvider);
  const { data } = await contract.populateTransaction['inviteNeighbor'](
    tokenId,
    inviteX,
    inviteY,
    recipient
  );
  const gasLimit = await contract.estimateGas['inviteNeighbor'](
    tokenId,
    inviteX,
    inviteY,
    recipient,
    {
      from: account
    }
  );
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
  const dataToSign = getDataToSignForEIP712(request);
  return dataToSign;
};

export const createSeed = async (
  x: number,
  y: number,
  account: string,
  jsonRpcProvider: JsonRpcProvider
) => {
  const contract = getContract(jsonRpcProvider);
  const { data } = await contract.populateTransaction['createSeed'](x, y);
  const gasLimit = await contract.estimateGas['createSeed'](x, y, {
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
  const dataToSign = getDataToSignForEIP712(request);
  return dataToSign;
};
