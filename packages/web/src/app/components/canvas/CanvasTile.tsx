import React, { useEffect, useState } from 'react';
import { useFetchTile } from '@app/features/Graph';
import useTilesInWallet from '@app/features/useTilesInWallet';
import { useWallet } from '@gimmixorg/use-wallet';
import useOpenNeighborsForWallet from '@app/features/useOpenNeighborsForWallet';
import { ENSName } from 'react-ens-name';

const CanvasTile = ({
  x,
  y,
  openEditor,
  openGenerateInvite,
  style
}: {
  x: number;
  y: number;
  openEditor: () => void;
  openGenerateInvite: () => void;
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

  const onClick = () => {
    if (isOwned && tile.status == 'UNLOCKED') openEditor();
    else if (isInvitable) openGenerateInvite();
  };
  return (
    <div className="tile" onClick={onClick} style={style}>
      {tile?.svg && (
        <div className="svg" dangerouslySetInnerHTML={{ __html: tile.svg }} />
      )}
      <div className="meta">
        <div className="coords">
          X: {x}
          <br />
          Y: {y}
        </div>
        {tile?.owner && (
          <div className="owner">
            {tile.owner.id.toLowerCase() ==
            process.env.NEXT_PUBLIC_LAND_GRANTER_CONTRACT_ADDRESS ? (
              'Unclaimed'
            ) : (
              <ENSName address={tile.owner.id} />
            )}
          </div>
        )}
        {isOwned && <div className="owned">[You Own This]</div>}
        {isInvitable && (
          <div className="invitable">[You Can Invite Someone]</div>
        )}
      </div>
      <style jsx>{`
        .tile {
          position: relative;
          border: ${tile?.status == 'LOCKED' ? 0 : 1}px dashed #f1f1f1;
          background-color: ${isInvitable
            ? '#ffd80033'
            : tile?.status == 'UNLOCKED'
            ? '#fafafa'
            : 'transparent'};
          background-size: 10% 10%;
          background-image: ${tile?.status == 'UNLOCKED'
            ? `radial-gradient(circle, #aaa 1px, rgba(0, 0, 0, 0) 1px)`
            : 'none'};
        }
        .tile:hover {
          background-color: #f1f1f1;
          border: ${tile?.status == 'LOCKED' ? 0 : 1}px dashed #ccc;
          cursor: pointer;
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
          bottom: 0;
          left: 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default React.memo(
  CanvasTile,
  (prev, next) => prev.x === next.x && prev.y === next.y
);
