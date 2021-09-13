import React from "react";
import useStore from "../features/State";
import { useFetchTile } from "@app/features/Graph";
import PALETTES from "src/constants/Palettes";
import { useWallet } from "@gimmixorg/use-wallet";

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
  console.log("Tile rendering", x, y);

  const { account } = useWallet();
  const activeCanvasID = useStore((state) => state.activeCanvas);
  const palette = PALETTES[activeCanvasID];
  const { tile } = useFetchTile(activeCanvasID, x, y);

  // ALTERNATE CODE FOR RENDERING OWNERSHIP OF TILE
  // background-color: ${tile &&
  // account &&
  // tile.owner.id == account.toLowerCase()
  //   ? "#00FF0066"
  //   : "#FF000066"};
  return (
    <div className="tile" onClick={handleTileClick} style={style}>
      {tile?.svg && (
        <div className="svg" dangerouslySetInnerHTML={{ __html: tile.svg }} />
      )}

      <style jsx>{`
        .tile {
          position: relative;
          border: 1px dashed ${palette[2]}77;
          background-color: ${tile
            ? `#${tile.owner.id.slice(2, 8)}33`
            : "#FFFFFF66"};
        }
        .tile:hover {
          background-color: ${account
            ? `#${account.slice(2, 8)}33`
            : "#f1f1f1"};
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

export default React.memo(Tile);
