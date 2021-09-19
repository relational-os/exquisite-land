import React, { useEffect, useState } from 'react';
import { useFetchTile } from '@app/features/Graph';
import useTilesInWallet from '@app/features/useTilesInWallet';
import { useWallet } from '@gimmixorg/use-wallet';
import useOpenNeighborsForWallet from '@app/features/useOpenNeighborsForWallet';

const Tile = ({
  x,
  y,
  handleTileClick,
  style
}: {
  x: number;
  y: number;
  handleTileClick: () => void;
  style?: React.CSSProperties;
}) => {
  const { tile } = useFetchTile(x, y);

  const { account } = useWallet();
  const { tiles: tilesOwned } = useTilesInWallet(account);
  const [isOwned, setOwned] = useState(false);
  useEffect(() => {
    if (tilesOwned?.find(t => t.x == x && t.y == y)) {
      setOwned(true);
    }
  }, [JSON.stringify(tilesOwned)]);

  const openNeighbors = useOpenNeighborsForWallet();
  const [isInvitable, setInvitable] = useState(false);
  useEffect(() => {
    if (openNeighbors?.find(t => t.x == x && t.y == y)) {
      setInvitable(true);
    }
  }, [JSON.stringify(openNeighbors)]);

  return (
    <div className="tile" onClick={handleTileClick} style={style}>
      {tile?.svg && (
        <div className="svg" dangerouslySetInnerHTML={{ __html: tile.svg }} />
      )}
      <div className="meta">
        <div className="coords">
          {x}, {y}
        </div>
        {isOwned && <div className="owned">(You Own This)</div>}
        {isInvitable && <div className="invitable">Invite Available!</div>}
      </div>
      <style jsx>{`
        .tile {
          position: relative;
          border: 1px dashed #ddd;
        }
        .tile:hover {
          background-color: #f1f1f1;
        }
        .svg {
          width: 100%;
          height: 100%;
        }
        .svg :global(svg) {
          display: block;
          width: 100%;
          height: 100%;
        }
        .meta {
          padding: 5px;
          opacity: 0.5;
          position: absolute;
          top: 0;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default React.memo(
  Tile,
  (prev, next) => prev.x === next.x && prev.y === next.y
);
