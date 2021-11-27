import {
  EXQUISITE_LAND_CONTRACT_ADDRESS,
  OPENSEA_URL
} from '@app/features/AddressBook';
import { useFetchTile } from '@app/features/Graph';
import { generateTokenID } from '@app/features/TileUtils';
import React from 'react';

import CachedENSName from '../CachedENSName';

const TileModal = ({ x, y }: { x: number; y: number }) => {
  const { tile } = useFetchTile(x, y);

  if (!tile) return null;
  return (
    <div className="tile-modal">
      {tile.svg && (
        <img
          src={`/api/tiles/terramasu/${x}/${y}/img`}
          width="100"
          height="100"
          className="tile-image"
        />
      )}
      <div className="meta">
        <a href="#" className="title">
          [{x},{y}] by <CachedENSName address={tile.owner.id} />
        </a>
        <div className="spacer"></div>
        <a
          href={`${OPENSEA_URL}${EXQUISITE_LAND_CONTRACT_ADDRESS}/${generateTokenID(
            x,
            y
          )}`}
          className="button"
          target="_blank"
        >
          <img src="/graphics/icon-opensea.svg" /> OpenSea
        </a>
      </div>
      <style jsx>{`
        .tile-modal {
          width: min(90vw, 500px);
        }
        .title {
          padding-bottom: 0.75rem;
          text-align: center;
          color: #fff;
          padding: 8px 0;
          text-decoration: none;
        }
        .title:hover {
          text-decoration: underline;
        }
        .title:hover::after {
          content: ' 🔗';
          position: absolute;
          margin-left: 0.5rem;
        }
        .tile-image {
          width: 100%;
          height: auto;
          image-rendering: pixelated;
          background: #222;
        }
        .meta {
          display: flex;
          margin: 0.5rem 0;
          justify-content: space-between;
          gap: 1rem;
          font-size: 1.25rem;
        }

        .spacer {
          flex: 1;
        }

        a.button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #ddd;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
          text-decoration: none;
        }
        a.button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }
        a.button img {
          width: 16px;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default TileModal;
