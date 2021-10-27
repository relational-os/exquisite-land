import useSWR from 'swr';
import getJsonRpcProvider from './getJsonRpcProvider';

const getENSName = (account: string) => {
  return getJsonRpcProvider().lookupAddress(account);
};
const useENSNameOrAddress = (account?: string) => {
  const { data } = useSWR(account ? [account, 'ens'] : null, getENSName, {
    dedupingInterval: 60 * 60 * 1000,
    revalidateOnFocus: false,
    refreshInterval: 0
  });
  return data
    ? data
    : account
    ? `${account.slice(0, 8)}...${account.slice(-6)}`
    : '';
};

export default useENSNameOrAddress;
