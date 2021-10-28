import {
  EXQUISITE_LAND_CONTRACT_ADDRESS,
  OPENSEA_URL
} from '@app/features/AddressBook';
import { useFetchTile } from '@app/features/Graph';
import { generateTokenID } from '@app/features/TileUtils';
import React from 'react';
import { ENSName } from 'react-ens-name';
import Button from '../Button';

const TileModal = ({ x, y }: { x: number; y: number }) => {
  const { tile } = useFetchTile(x, y);

  if (!tile) return null;
  return (
    <div className="tile-modal">
      {tile.svg && (
        <>
          <div className="tile-modal-header">
            [{x},{y}]
          </div>
          <img
            src={`/api/tiles/terramasu/${x}/${y}/image`}
            width="100"
            height="100"
            className="tile-image"
          />
        </>
      )}
      <div className="meta">
        <div className="owner">
          by <ENSName address={tile.owner.id} />
        </div>
        <Button style={{ margin: '.5rem' }}>TODO: txn hash</Button>
        <Button>
          <a
            href={`${OPENSEA_URL}${EXQUISITE_LAND_CONTRACT_ADDRESS}/${generateTokenID(
              x,
              y
            )}`}
          >
            OpenSea
          </a>
        </Button>
      </div>
      <style jsx>{`
        .tile-modal {
          width: min(90vw, 500px);
        }
        .tile-modal-header {
          padding-bottom: 0.75rem;
          text-align: center;
          font-size: 1.5rem;
          color: #fff;
        }
        .tile-image {
          width: 100%;
          height: auto;
          image-rendering: pixelated;
        }
        .meta {
          display: flex;
          padding: 10px 0;
          color: white;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
};

export default TileModal;
