import React from 'react';

const NetworkName = ({ network }: { network: string }) => {
  switch (network) {
    case 'mumbai':
      return <>Polygon (Testnet)</>;
    case 'rinkeby':
      return <>Rinkeby (Testnet)</>;
    default:
      return <>{sentenceCaps(network)}</>;
  }
};

export default NetworkName;

const sentenceCaps = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
