import useSWR, { SWRConfiguration } from 'swr';

// export type GraphTile = {
//   id: string;
//   x: number;
//   y: number;
//   status: 'LOCKED' | 'UNLOCKED';
//   svg: string;
//   owner?: { id: string };
//   canvas?: { id: string };
// };

const getGorblinTiles = async (): Promise<any | null> => {
  const response = await fetch('/api/gorblin/giveaway', {});
  const responseJson = await response.json();
  return responseJson.giveaways;
};

const useGorblinTile = (swrOptions?: Partial<SWRConfiguration>) => {
  const { data, error, mutate } = useSWR<any | null>(
    ['useGorblinTile'],
    getGorblinTiles,
    {
      revalidateOnMount: true,
      ...swrOptions
    }
  );
  return { tiles: data, error, refresh: mutate };
};

export default useGorblinTile;
