import useSWR, { SWRConfiguration } from 'swr';

const getGorblinCoins = async (): Promise<any | null> => {
  const response = await fetch('/api/gorblin/coins', {}).then((res) => {
    return res.json();
  });
  return response.coins;
};

const useGorblinTile = (swrOptions?: Partial<SWRConfiguration>) => {
  const { data, error, mutate } = useSWR<any | null>(
    ['useGorblinCoins'],
    getGorblinCoins,
    {
      revalidateOnMount: true,
      ...swrOptions
    }
  );
  return { coins: data, error, refresh: mutate };
};

export default useGorblinTile;
