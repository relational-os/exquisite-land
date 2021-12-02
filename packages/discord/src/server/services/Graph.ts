import { GRAPH_URL } from '@app/features/AddressBook';
import request, { gql } from 'graphql-request';

// TODO: handle 501 errors
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
      tiles(first: 500, orderby: createdAt, orderDirection: desc) {
        id
        svg
        status
        x
        y
        owner {
          address
        }
      }
    }
  `;
  const data = await request(GRAPH_URL, query);
  // filter out tiles with a null svg value

  // @ts-ignore
  let filtered = data.tiles.filter((tile) => {
    return tile.svg !== null;
  });
  return filtered;
};
