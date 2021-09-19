import { useWallet } from '@gimmixorg/use-wallet';
import { useEffect, useState } from 'react';
import { generateTokenID } from './TileUtils';
import { getTile } from './useTile';
import useTilesInWallet from './useTilesInWallet';

const useOpenNeighborsForWallet = () => {
  const { account } = useWallet();
  const { tiles } = useTilesInWallet(account);
  const [openNeighbors, setOpenNeighbors] = useState<
    {
      x: number;
      y: number;
      tokenId: number;
      ownTokenId: number;
    }[]
  >([]);
  useEffect(() => {
    (async () => {
      if (!tiles) return;
      const openNeighbors = [];
      for (const tile of tiles) {
        if (tile.status == 'UNLOCKED') continue;
        const westOpen =
          tile.x > 0 && !(await getTile(generateTokenID(tile.x - 1, tile.y)));
        if (westOpen)
          openNeighbors.push({
            x: tile.x - 1,
            y: tile.y,
            tokenId: generateTokenID(tile.x - 1, tile.y),
            ownTokenId: parseInt(tile.id)
          });
        const eastOpen = !(await getTile(generateTokenID(tile.x + 1, tile.y)));
        if (eastOpen)
          openNeighbors.push({
            x: tile.x + 1,
            y: tile.y,
            tokenId: generateTokenID(tile.x - 1, tile.y),
            ownTokenId: parseInt(tile.id)
          });
        const northOpen =
          tile.y > 0 && !(await getTile(generateTokenID(tile.x, tile.y - 1)));
        if (northOpen)
          openNeighbors.push({
            x: tile.x,
            y: tile.y - 1,
            tokenId: generateTokenID(tile.x - 1, tile.y),
            ownTokenId: parseInt(tile.id)
          });
        const southOpen = !(await getTile(generateTokenID(tile.x, tile.y + 1)));
        if (southOpen)
          openNeighbors.push({
            x: tile.x,
            y: tile.y + 1,
            tokenId: generateTokenID(tile.x - 1, tile.y),
            ownTokenId: parseInt(tile.id)
          });
      }
      setOpenNeighbors(openNeighbors);
    })();
  }, [JSON.stringify(tiles)]);
  return openNeighbors;
};

export default useOpenNeighborsForWallet;
