import React from 'react';
import useSWR from 'swr';

const CachedENSName = ({ address }: { address?: string }) => {
  const { data } = useSWR<{ name: string }>(
    address
      ? `https://exquisite.land/api/ens-name?address=${address.toLowerCase()}`
      : null,
    (url: string) => fetch(url).then((res) => res.json())
  );
  if (!data) return null;
  return <>{data.name}</>;
};

export default CachedENSName;
