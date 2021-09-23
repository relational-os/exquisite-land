import request, { gql } from 'graphql-request';

export const GRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/relational-os/exquisite-land';

export const getTilesInWallet = async (address: string) => {
  const query = gql`
    query TilesInWalletQuery($address: String) {
      player(id: $address) {
        tiles(first: 500) {
          id
          x
          y
          status
          svg
        }
      }
    }
  `;
  const { player } = await request(GRAPH_URL, query, {
    address: address.toLowerCase()
  });
  return player?.tiles || [];
};
