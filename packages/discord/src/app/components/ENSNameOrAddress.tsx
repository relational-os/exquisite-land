import useENSNameOrAddress from '@app/features/useENSorAddress';
import React from 'react';

const ENSNameOrAddress = ({ address }: { address: string }) => {
  const name = useENSNameOrAddress(address);
  return <>{name}</>;
};

export default ENSNameOrAddress;
