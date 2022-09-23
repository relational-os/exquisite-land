import { request, gql } from 'graphql-request';
import useSWR, { SWRConfiguration } from 'swr'; 
// import { GRAPH_URL } from './AddressBook';

// TODO: pagination

export const getSlimePools = async () => {
  const query = gql`
    {
      slimePools(first:100) {
        id
        totalSlime
      }
    }
  `
  const data = await request("https://api.thegraph.com/subgraphs/name/relational-os/xqst-canvas-2", query);
  return data.slimePools;
};
