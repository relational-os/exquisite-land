import { useWallet } from '@gimmixorg/use-wallet';
import { useEffect } from 'react';
import { generateTokenID, getCoordinates } from './TileUtils';
import { GraphTile } from './useTile';
import useTilesInWallet from './useTilesInWallet';
import create from 'zustand';
import { GRAPH_URL, LAND_GRANTER_CONTRACT_ADDRESS } from './AddressBook';
import request, { gql } from 'graphql-request';
import useTransactionsStore from './useTransactionsStore';

export enum OpenNeighborStatus {
  OPEN,
  COIN_GENERATED
}

type OpenNeighborsType = {
  x: number;
  y: number;
  tokenId: number;
  ownTokenId: number;
  status: OpenNeighborStatus;
};

export const useOpenNeighborStore = create<{
  openNeighbors: OpenNeighborsType[];
}>((set) => ({
  openNeighbors: []
}));

const query = gql`
  query TilesQuery($tokenIds: [ID!]) {
    tiles(where: { id_in: $tokenIds }) {
      id
      x
      y
      status
      svg
      owner {
        id
      }
    }
  }
`;

const getNeighbors = async (
  tiles: string[]
): Promise<Map<string, GraphTile>> => {
  const neighborMap = new Map<string, GraphTile>();
  const response = await request(GRAPH_URL, query, { tokenIds: tiles });

  if (response && response.tiles) {
    (response.tiles as GraphTile[]).map((tile) => {
      neighborMap.set(tile.id, tile);
    });
  }

  return neighborMap;
};

const useOpenNeighborsForWallet = () => {
  const { account } = useWallet();
  const { tiles } = useTilesInWallet(account);
  const openNeighbors = useOpenNeighborStore((state) => state.openNeighbors);
  const transactions = useTransactionsStore((state) => state.transactions);

  useEffect(() => {
    (async () => {
      if (!tiles) return useOpenNeighborStore.setState({ openNeighbors: [] });
      const openNeighbors = [];

      let validTiles = tiles.filter((tile) => {
        return tile.status === 'LOCKED';
      });

      const mintingTxs = transactions.filter(
        (tx) =>
          tx.type == 'create-tile' &&
          tx.account?.toLowerCase() == account?.toLowerCase()
      );
      const mintingTiles: GraphTile[] = mintingTxs.map((tx) => {
        return {
          x: tx.x!,
          y: tx.y!,
          id: generateTokenID(tx.x!, tx.y!).toString(),
          status: 'LOCKED',
          svg: ''
        };
      });

      validTiles = [...validTiles, ...mintingTiles];

      if (!validTiles)
        return useOpenNeighborStore.setState({ openNeighbors: [] });

      const queryMap = new Map<string, string[]>();

      const neighboringTiles = (validTiles as GraphTile[]).flatMap((tile) => {
        const neighbors = [];

        if (tile.x > 0) {
          neighbors.push(generateTokenID(tile.x - 1, tile.y).toString());
        }
        if (tile.x < 16) {
          neighbors.push(generateTokenID(tile.x + 1, tile.y).toString());
        }
        if (tile.y > 0) {
          neighbors.push(generateTokenID(tile.x, tile.y - 1).toString());
        }
        if (tile.y < 16) {
          neighbors.push(generateTokenID(tile.x, tile.y + 1).toString());
        }

        queryMap.set(tile.id, neighbors);

        return neighbors;
      });

      const tilesToQuery = [...new Set(neighboringTiles)];
      const graphNeighbors = await getNeighbors(tilesToQuery);

      const pushedNeighbors = new Map<string, string>();

      for (const tile of validTiles as GraphTile[]) {
        for (const potentialNeighbor of queryMap.get(tile.id)!) {
          if (pushedNeighbors.get(potentialNeighbor)) continue;

          const neighbor = graphNeighbors.get(potentialNeighbor);
          pushedNeighbors.set(potentialNeighbor, potentialNeighbor);

          const [x, y] = getCoordinates(parseInt(potentialNeighbor));

          if (
            !neighbor ||
            neighbor.owner!.id.toLowerCase() ==
              LAND_GRANTER_CONTRACT_ADDRESS.toLowerCase()
          ) {
            openNeighbors.push({
              x,
              y,
              tokenId: parseInt(potentialNeighbor),
              ownTokenId: parseInt(tile.id),
              status: !neighbor
                ? OpenNeighborStatus.OPEN
                : OpenNeighborStatus.COIN_GENERATED
            });
          }
        }
      }

      useOpenNeighborStore.setState({ openNeighbors });
    })();
  }, [JSON.stringify(tiles), account, transactions]);

  return openNeighbors;
};

export default useOpenNeighborsForWallet;
