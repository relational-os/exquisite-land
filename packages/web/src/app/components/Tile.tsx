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
  let svg = useStore((state) => state.svgs[`${x}-${y}`]);
  return (
    <div className="tile" onClick={(e) => handleTileClick()}>
      {svg && <div dangerouslySetInnerHTML={{ __html: svg }}></div>}
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
