import { request, gql } from 'graphql-request';
import useSWR, { SWRConfiguration } from 'swr'; 
import { CANVAS_2_GRAPH_URL } from './AddressBook';

// TODO: pagination
const query = gql`
  {
    slimePools(first:100) {
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
    () => request(CANVAS_2_GRAPH_URL, query),
    { revalidateOnMount: true, ...swrOptions }
  );

  return { data: data?.slimePools, error, refresh: mutate };
};
