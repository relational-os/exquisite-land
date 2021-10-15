import { useFetchTile } from '@app/features/Graph';
import React from 'react';
import { ENSName } from 'react-ens-name';

const TileModal = ({ x, y }: { x: number; y: number }) => {
  const { tile } = useFetchTile(x, y);
  if (!tile) return null;
  return (
    <div className="tile-modal">
      {tile.svg && (
        <img
          src={`/api/tiles/terramasu/${x}/${y}/image`}
          width="100"
          height="100"
          className="tile-image"
        />
      )}
      <div className="meta">
        <div className="owner">
          Owned by <ENSName address={tile.owner.id} />
        </div>
      </div>
      <style jsx>{`
        .tile-modal {
          width: min(90vw, 500px);
        }
        .tile-image {
          width: 100%;
          height: auto;
          image-rendering: pixelated;
        }
        .meta {
          padding: 10px 0;
          color: white;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
};

export default TileModal;
