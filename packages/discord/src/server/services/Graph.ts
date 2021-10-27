import { GRAPH_URL } from '@app/features/AddressBook';
import request, { gql } from 'graphql-request';

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

export const getAllTiles = async () => {
  const query = gql`
    {
      tiles(first: 500) {
        id
        svg
        x
        y
      }
    }
  `;
  const data = await request(GRAPH_URL, query);
  return data;
};
