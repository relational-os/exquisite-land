import { request, gql } from 'graphql-request';
import useSWR, { SWRConfiguration } from 'swr'; 
import { CANVAS_2_GRAPH_URL } from './AddressBook';

const EventsQuery = gql`
  query slimeEventsQuery($address: String) {
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

export const useFetchSlimeEvents = (
  variables?: {address?: string},
  swrOptions?: Partial<SWRConfiguration>
) => {
  const { data, error, mutate } = useSWR(
    ['canvas-slime-events'],
    () => request(CANVAS_2_GRAPH_URL, EventsQuery, variables),
    { revalidateOnMount: true, ...swrOptions }
  );

  return { data: data, error, refresh: mutate };
};
