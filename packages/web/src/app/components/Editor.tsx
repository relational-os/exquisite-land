import React, { useRef, useState } from "react";
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
  const pallete = useStore((state) => state.pallete);
  const [activeColor, setActiveColor] = useState("#000");

  async function handleSave() {
    console.log(`tile(${x}, ${y}) saved!`);

    if (!canvasRef.current) {
      return;
    }

    let svg = await canvasRef.current.exportSvg();
    console.log("saving svg to state", svg);
    useStore.setState((current) => {
      current.tiles[`${x}-${y}`] = {
        svg,
        status: TileStatus.DRAWN,
        type: TileType.SOLO,
      };
      return current;
    });

    closeModal();
  }
  const canvasRef = useRef<ReactSketchCanvas>(null);
  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
  };
  return (
    <div className="editor">
      <ReactSketchCanvas
        ref={canvasRef}
        height="600px"
        width="600px"
        strokeWidth={4}
        strokeColor={activeColor}
        style={styles}
      />
      <div className="color-picker">
        {pallete.map((color) => {
          return (
            <div
              key={color}
              className="dot"
              style={{ backgroundColor: color }}
              onClick={() => setActiveColor(color)}
            ></div>
          );
        })}
      </div>
      <button onClick={handleSave}>Save</button>
      <style jsx>{`
        .editor {
        }

        .color-picker {
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Editor;
