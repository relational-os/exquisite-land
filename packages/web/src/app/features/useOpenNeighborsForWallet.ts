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
      canvasId: number;
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
          tile.x > 0 &&
          !(await getTile(generateTokenID(tile.canvas.id, tile.x - 1, tile.y)));
        if (westOpen)
          openNeighbors.push({
            canvasId: tile.canvas.id,
            x: tile.x - 1,
            y: tile.y,
            tokenId: generateTokenID(tile.canvas.id, tile.x - 1, tile.y),
            ownTokenId: parseInt(tile.id)
          });
        const eastOpen = !(await getTile(
          generateTokenID(tile.canvas.id, tile.x + 1, tile.y)
        ));
        if (eastOpen)
          openNeighbors.push({
            canvasId: tile.canvas.id,
            x: tile.x + 1,
            y: tile.y,
            tokenId: generateTokenID(tile.canvas.id, tile.x - 1, tile.y),
            ownTokenId: parseInt(tile.id)
          });
        const northOpen =
          tile.y > 0 &&
          !(await getTile(generateTokenID(tile.canvas.id, tile.x, tile.y - 1)));
        if (northOpen)
          openNeighbors.push({
            canvasId: tile.canvas.id,
            x: tile.x,
            y: tile.y - 1,
            tokenId: generateTokenID(tile.canvas.id, tile.x - 1, tile.y),
            ownTokenId: parseInt(tile.id)
          });
        const southOpen = !(await getTile(
          generateTokenID(tile.canvas.id, tile.x, tile.y + 1)
        ));
        if (southOpen)
          openNeighbors.push({
            canvasId: tile.canvas.id,
            x: tile.x,
            y: tile.y + 1,
            tokenId: generateTokenID(tile.canvas.id, tile.x - 1, tile.y),
            ownTokenId: parseInt(tile.id)
          });
      }
      setOpenNeighbors(openNeighbors);
    })();
  }, [tiles]);
  return openNeighbors;
};

export default useOpenNeighborsForWallet;
