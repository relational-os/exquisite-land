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

const getGorblinTile = async (): Promise<any | null> => {
  const response = await fetch('/api/gorblin/next-tile', {}).then((res) => {
    return res.json();
  });
  return response.tile;
};

const useGorblinTile = (swrOptions?: Partial<SWRConfiguration>) => {
  const { data, error, mutate } = useSWR<any | null>(
    ['useGorblinTile'],
    getGorblinTile,
    {
      revalidateOnMount: true,
      ...swrOptions
    }
  );
  return { tile: data, error, refresh: mutate };
};

export default useGorblinTile;
