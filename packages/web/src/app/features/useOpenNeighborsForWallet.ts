import { useWallet } from '@gimmixorg/use-wallet';
import { useEffect } from 'react';
import { generateTokenID } from './TileUtils';
import { getTile } from './useTile';
import useTilesInWallet from './useTilesInWallet';
import create from 'zustand';
import { LAND_GRANTER_CONTRACT_ADDRESS } from './AddressBook';

export enum OpenNeighborStatus {
  OPEN,
  COIN_GENERATED
}

export const useOpenNeighborStore = create<{
  openNeighbors: {
    x: number;
    y: number;
    tokenId: number;
    ownTokenId: number;
    status: OpenNeighborStatus;
  }[];
}>((set) => ({
  openNeighbors: []
}));

const useOpenNeighborsForWallet = () => {
  const { account } = useWallet();
  const { tiles } = useTilesInWallet(account);
  const openNeighbors = useOpenNeighborStore((state) => state.openNeighbors);

  useEffect(() => {
    (async () => {
      if (!tiles) return;
      const openNeighbors = [];
      for (const tile of tiles) {
        if (tile.status == 'UNLOCKED') continue;
        const westTile = await getTile(generateTokenID(tile.x - 1, tile.y));
        const westOpen =
          tile.x > 0 &&
          (!westTile ||
            westTile.owner!.id.toLowerCase() ==
              LAND_GRANTER_CONTRACT_ADDRESS.toLowerCase());
        if (westOpen)
          openNeighbors.push({
            x: tile.x - 1,
            y: tile.y,
            tokenId: generateTokenID(tile.x - 1, tile.y),
            ownTokenId: parseInt(tile.id),
            status: !westTile
              ? OpenNeighborStatus.OPEN
              : OpenNeighborStatus.COIN_GENERATED
          });
        const eastTile = await getTile(generateTokenID(tile.x + 1, tile.y));
        const eastOpen =
          tile.x < 16 &&
          (!eastTile ||
            eastTile.owner!.id.toLowerCase() ==
              LAND_GRANTER_CONTRACT_ADDRESS.toLowerCase());
        if (eastOpen)
          openNeighbors.push({
            x: tile.x + 1,
            y: tile.y,
            tokenId: generateTokenID(tile.x + 1, tile.y),
            ownTokenId: parseInt(tile.id),
            status: !eastTile
              ? OpenNeighborStatus.OPEN
              : OpenNeighborStatus.COIN_GENERATED
          });

        const northTile = await getTile(generateTokenID(tile.x, tile.y - 1));
        const northOpen =
          tile.y > 0 &&
          (!northTile ||
            northTile.owner!.id.toLowerCase() ==
              LAND_GRANTER_CONTRACT_ADDRESS.toLowerCase());
        if (northOpen)
          openNeighbors.push({
            x: tile.x,
            y: tile.y - 1,
            tokenId: generateTokenID(tile.x, tile.y + 1),
            ownTokenId: parseInt(tile.id),
            status: !northTile
              ? OpenNeighborStatus.OPEN
              : OpenNeighborStatus.COIN_GENERATED
          });

        const southTile = await getTile(generateTokenID(tile.x, tile.y + 1));
        const southOpen =
          tile.y < 16 &&
          (!southTile ||
            southTile.owner!.id.toLowerCase() ==
              LAND_GRANTER_CONTRACT_ADDRESS.toLowerCase());
        if (southOpen)
          openNeighbors.push({
            x: tile.x,
            y: tile.y + 1,
            tokenId: generateTokenID(tile.x, tile.y - 1),
            ownTokenId: parseInt(tile.id),
            status: !southTile
              ? OpenNeighborStatus.OPEN
              : OpenNeighborStatus.COIN_GENERATED
          });
      }
      useOpenNeighborStore.setState({ openNeighbors });
    })();
  }, [JSON.stringify(tiles), account]);

  return openNeighbors;
};

export default useOpenNeighborsForWallet;
