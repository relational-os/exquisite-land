import React, { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import useStore, { TileStatus, TileType } from "../features/State";

const PATH_DECIMAL_MODIFIER = 1000;

const Editor = ({
  x,
  y,
  closeModal,
}: {
  x: number;
  y: number;
  closeModal: () => void;
}) => {
  const palette = useStore((state) => state.canvases[0].palette);
  const [activeColor, setActiveColor] = useState("#000");
  const [activeBrushSize, setActiveBrushSize] = useState(4);
  const [activeTool, setActiveTool] = useState<"pen" | "eraser">("pen");

  // prettier-ignore
  const circleSVG = `'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewbox="0 0 32 32" width="32" height="32"><circle r="${activeBrushSize / 2}" cx="16" cy="16" fill="${activeColor.replace("#", "%23")}"/></svg>'`;
  const cursorOffset = 14; // this should be 16 to center the pointer, unclear why it's off by 2

  function handleClear() {
    canvasRef.current?.resetCanvas();
  }

  async function handleSave() {
    console.log(`tile(${x}, ${y}) saved!`);

    if (!canvasRef.current) {
      return;
    }

    let svg = await canvasRef.current.exportSvg();
    let paths = await canvasRef.current.exportPaths();
    console.log("paths", paths);

    const paletteMap = palette.reduce(
      (previous: Record<string, number>, hex: string, index: number) => {
        previous[hex] = index;
        return previous;
      },
      {}
    );

    // TODO: add to SOL contract
    const strokeMap: Record<number, number> = { 4: 0, 16: 1 };

    let packagedPaths = paths.map((path) => {
      let strokeColor = path.strokeColor;
      let strokeWidth = path.strokeWidth;
      let strokePaths = path.paths;

      let outputPaths = strokePaths.map((strokePath) => [
        strokePath.x * PATH_DECIMAL_MODIFIER,
        strokePath.y * PATH_DECIMAL_MODIFIER,
      ]);

      return {
        strokeColor: paletteMap[strokeColor],
        strokeWidth: strokeMap[strokeWidth],
        paths: outputPaths,
      };
    });

    console.log("packagedPaths", packagedPaths);

    console.log("saving svg to state", svg);

    useStore.setState((state) => {
      state.canvases[state.activeCanvas].tiles[`${x}-${y}`] = {
        svg,
        status: TileStatus.DRAWN,
        type: TileType.SOLO,
      };
      return state;
    });

    closeModal();
  }
  const canvasRef = useRef<ReactSketchCanvas>(null);
  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
  };

  useEffect(() => {
    console.log("setting active tool to", activeTool == "eraser");
    canvasRef.current?.eraseMode(activeTool == "eraser");
  }, [activeTool]);

  return (
    <div className="editor">
      <div className="canvas">
        <ReactSketchCanvas
          ref={canvasRef}
          height="600px"
          width="600px"
          strokeWidth={activeBrushSize}
          strokeColor={activeColor}
          style={styles}
        />
      </div>
      <div className="color-picker">
        Color Picker
        {palette.map((color) => {
          return (
            <div
              key={color}
              className="color-dot"
              style={{ backgroundColor: color }}
              onClick={() => setActiveColor(color)}
            ></div>
          );
        })}
      </div>
      <div className="color-picker">
        Brush Size
        <div
          className="small-brush"
          onClick={() => setActiveBrushSize(4)}
        ></div>
        <div
          className="large-brush"
          onClick={() => setActiveBrushSize(16)}
        ></div>
      </div>

      <label>
        <input
          name="tool"
          type="radio"
          checked={activeTool == "pen"}
          onChange={() => setActiveTool("pen")}
        />
        Pen
      </label>
      <label>
        <input
          name="tool"
          type="radio"
          checked={activeTool == "eraser"}
          onChange={() => setActiveTool("eraser")}
        />
        Eraser
      </label>

      <div>
        <button onClick={handleClear}>Clear Tile</button>
        <button onClick={handleSave}>Save</button>
      </div>
      <style jsx>{`
        .editor {
        }

        .canvas {
          cursor: url(${circleSVG}) ${cursorOffset} ${cursorOffset}, auto;
        }

        .color-picker {
          display: flex;
          gap: 0.5rem;
        }

        .color-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        .small-brush {
          width: 16px;
          height: 16px;
          background-color: ${activeColor};
          border-radius: 50%;
        }

        .large-brush {
          width: 32px;
          height: 32px;
          background-color: ${activeColor};
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Editor;
