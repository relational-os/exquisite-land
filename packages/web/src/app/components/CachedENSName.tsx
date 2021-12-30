import React from 'react';
import useSWR from 'swr';

const CachedENSName = ({ address }: { address?: string }) => {
  const { data } = useSWR<{ name: string }>(
    address
      ? `https://api.ensideas.com/ens/resolve/${encodeURIComponent(address)}`
      : null,
    (url: string) => fetch(url).then((res) => res.json())
  );
  if (!data) return null;
  if (data.name == null) {
    return <>{address?.slice(0, 6)}</>;
  } else {
    return <>{data.name}</>;
  }
};

export default CachedENSName;
