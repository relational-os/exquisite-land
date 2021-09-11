import React from "react";
import useStore from "../features/State";

const Tile = ({
  x,
  y,
  handleTileClick,
}: {
  x: number;
  y: number;
  handleTileClick: () => void;
}) => {
  let tile = useStore(
    (state) => state.canvases[state.activeCanvas].tiles[`${x}-${y}`]
  );

  return (
    <div className="tile" onClick={(e) => handleTileClick()}>
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

export default Tile;
