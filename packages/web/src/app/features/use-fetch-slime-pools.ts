import { request, gql } from 'graphql-request';
import useSWR, { SWRConfiguration } from 'swr'; 
import { CANVAS_2_GRAPH_URL } from './AddressBook';

// TODO: pagination
const PoolsQuery = gql`
   {
    slimePools(first:100, orderBy: totalSlime, orderDirection: desc) {
      id
      totalSlime
    }
  }
`

export const useFetchSlimePools = (
  swrOptions?: Partial<SWRConfiguration>
) => {
  const { data, error, mutate } = useSWR(
    ['canvas-slimepools'],
    () => request(CANVAS_2_GRAPH_URL, PoolsQuery),
    { revalidateOnMount: true, ...swrOptions }
  );

  return { data: data, error, refresh: mutate };
};
