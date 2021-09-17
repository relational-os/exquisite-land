import React from "react";
import useStore from "../features/State";
import { useFetchTile } from "@app/features/Graph";
import PALETTES from "src/constants/Palettes";

const Tile = ({
  x,
  y,
  handleTileClick,
  style,
}: {
  x: number;
  y: number;
  handleTileClick: () => void;
  style?: React.CSSProperties;
}) => {
  const activeCanvasID = useStore((state) => state.activeCanvas);
  const palette = PALETTES[activeCanvasID];
  const { tile } = useFetchTile(x, y);
  return (
    <div className="tile" onClick={handleTileClick} style={style}>
      {tile?.svg && (
        <div className="svg" dangerouslySetInnerHTML={{ __html: tile.svg }} />
      )}
      <style jsx>{`
        .tile {
          position: relative;
          border: 1px dashed ${palette[2]}77;
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
      `}</style>
    </div>
  );
};

export default React.memo(
  Tile,
  (prev, next) => prev.x === next.x && prev.y === next.y
);
