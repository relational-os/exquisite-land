import request, { gql } from 'graphql-request';
import useSWR, { SWRConfiguration } from 'swr';
import { GRAPH_URL } from './AddressBook';

export type GraphTile = {
  id: string;
  x: number;
  y: number;
  status: 'LOCKED' | 'UNLOCKED';
  svg: string;
  owner?: { id: string };
  canvas?: { id: string };
};

const query = gql`
  query TileQuery($tokenId: String) {
    tile(id: $tokenId) {
      id
      x
      y
      status
      svg
      owner {
        id
      }
    }
  }
`;

export const getTile = async (tokenId: number): Promise<GraphTile | null> => {
  const data = await request(GRAPH_URL, query, { tokenId: `${tokenId}` });
  return data?.tile || null;
};

const useTile = (tokenId: number, swrOptions?: Partial<SWRConfiguration>) => {
  const { data, error, mutate } = useSWR<GraphTile | null>(
    [tokenId, 'useTile'],
    getTile,
    {
      revalidateOnMount: true,
      ...swrOptions
    }
  );
  return { tile: data, error, refresh: mutate };
};

export default useTile;
