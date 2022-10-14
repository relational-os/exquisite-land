import { request, gql } from 'graphql-request';
import useSWR, { SWRConfiguration } from 'swr'; 
import { CANVAS_2_GRAPH_URL } from './AddressBook';

// TODO: pagination
const query = gql`
  query slimePoolsQuery($address: String) {
    slimePools(first:100, orderBy: totalSlime, orderDirection: desc) {
      id
      totalSlime
    }
    slimeEvents(where: {address: $address}, first: 100, orderBy: createdAt, orderDirection: desc) {
      id
      slimeAmount
      slimePool {
        id
      }
      address
      createdAt
    }
  }
`

export const useFetchSlimePools = (
  variables?: {address?: string},
  swrOptions?: Partial<SWRConfiguration>
) => {
  const { data, error, mutate } = useSWR(
    ['canvas-slimepools'],
    () => request(CANVAS_2_GRAPH_URL, query, variables),
    { revalidateOnMount: true, ...swrOptions }
  );

  return { data: data, error, refresh: mutate };
};
