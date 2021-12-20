import { GRAPH_URL } from '@app/features/AddressBook';
import request, { gql } from 'graphql-request';
import dayjs from 'dayjs';

export const getNextTiles = async (): Promise<
  | {
      id: string;
      x: string;
      y: string;
      updatedAt: string;
      owner: {
        id: string;
      };
      svg: string | null;
    }[]
  | null
> => {
  const query = gql`
    {
      tiles(
        first: 500
        orderBy: updatedAt
        orderDirection: asc
        where: { status: "UNLOCKED", updatedAt_lt: "${dayjs()
          .subtract(1, 'day')
          .unix()}", svg: null }
      ) {
        id
        svg
        x
        y
        updatedAt
        owner {
          id
        }
      }
    }
  `;
  const { tiles } = await request(GRAPH_URL, query);

  // Find hoarders
  const allOwners = tiles.reduce((acc: any, tile: any) => {
    if (!acc[tile.owner.id]) acc[tile.owner.id] = 0;
    acc[tile.owner.id]++;
    return acc;
  }, {});
  let greatestHoarder: string | null = null;
  const greatestHoarderEntry: [string, number] = Object.entries(allOwners).sort(
    (a: any, b: any) => {
      return b[1] - a[1];
    }
  )[0] as [string, number];
  if (greatestHoarderEntry[1] > 0) greatestHoarder = greatestHoarderEntry[0];

  if (greatestHoarder)
    return tiles.sort((tile: any) => tile.owner.id === greatestHoarder);
  else if (tiles.length) tiles;
  return null;
};
