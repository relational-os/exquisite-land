import React, { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import useStore, { TileStatus, TileType } from "../features/State";

const Editor = ({
  x,
  y,
  closeModal,
}: {
  x: number;
  y: number;
  closeModal: () => void;
}) => {
  const pallete = useStore((state) => state.canvases[0].pallete);
  const [activeColor, setActiveColor] = useState("#000");
  const [activeBrushSize, setActiveBrushSize] = useState(4);
  const [activeTool, setActiveTool] = useState<"pen" | "eraser">("pen");

  const circleSVG = `'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewbox="0 0 ${
    activeBrushSize * 2
  } ${
    activeBrushSize * 2
  }" width="${activeBrushSize}px" height="${activeBrushSize}px"><circle cx="${
    activeBrushSize / 2
  }px" cy="${activeBrushSize / 2}px" r="${
    activeBrushSize / 2
  }px" fill="${activeColor.replace("#", "%23")}"/></svg>'`;

  function handleClear() {
    canvasRef.current?.resetCanvas();
  }

  async function handleSave() {
    console.log(`tile(${x}, ${y}) saved!`);

    if (!canvasRef.current) {
      return;
    }

    let svg = await canvasRef.current.exportSvg();
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
        {pallete.map((color) => {
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
          cursor: url(${circleSVG}) 6 6, auto;
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
