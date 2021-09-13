import React from 'react';
import useStore from '../features/State';
import { useFetchTile } from '@app/features/Graph';

const Tile = ({
  x,
  y,
  handleTileClick
}: {
  x: number;
  y: number;
  handleTileClick: () => void;
}) => {
  let activeCanvasID = useStore(state => state.activeCanvas);
  let { tile } = useFetchTile(activeCanvasID, x, y);

  return (
    <div className="tile" onClick={handleTileClick}>
      {tile?.svg && <div dangerouslySetInnerHTML={{ __html: tile.svg }}></div>}
      <style jsx>{`
        .tile {
          border: lightblue 1px solid;
        }
        .tile:hover {
          background-color: lightcoral;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Tile);
