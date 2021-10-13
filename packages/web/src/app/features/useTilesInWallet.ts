import request, { gql } from 'graphql-request';
import useSWR, { SWRConfiguration } from 'swr';
import { GRAPH_URL } from './AddressBook';
import { GraphTile } from './useTile';

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

export const useTilesInWallet = (
  address?: string,
  swrOptions?: Partial<SWRConfiguration>
) => {
  const { data, error, mutate } = useSWR<{ player: { tiles: GraphTile[] } }>(
    address ? [address, 'useTilesInWallet'] : null,
    (address) => request(GRAPH_URL, query, { address: address.toLowerCase() }),
    swrOptions
  );
  const tiles = data?.player?.tiles.map((tile) => ({
    ...tile,
    x: Number(tile.x),
    y: Number(tile.y)
  }));
  return { tiles, error, refresh: mutate };
};

export default useTilesInWallet;
