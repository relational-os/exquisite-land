import React from "react";
import useStore from "@app/features/State";
import useEditor from "@app/hooks/use-editor";
import PALETTES from "src/constants/Palettes";
import Swatch from "@app/components/Swatch";

const ColorPicker = () => {
  let activeCanvasID = useStore((state) => state.activeCanvas);
  const palette = PALETTES[activeCanvasID];

  return (
    <>
      <div className="color-picker">
        {palette.map((color: string) => (
          <SwatchButton key={color} color={color} />
        ))}
      </div>

      <style jsx>{`
        .color-picker {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
      `}</style>
    </>
  );
};

interface SwatchProps {
  color: string;
}

const SwatchButton = ({ color }: SwatchProps) => {
  const { brushColor, setActiveColor } = useEditor();
  const isActive = color === brushColor;
  const transform = isActive ? "scale(1.25)" : "scale(1)";
  const activeStyle = {
    position: "absolute" as "absolute",
    fill: "white",
    transform: "scale(0.2)",
    opacity: isActive ? 1 : 0,
    transition: "opacity 0.2s ease-in-out",
  };

  return (
    <>
      <button
        className="color-swatch-button"
        onClick={() => setActiveColor(color)}
        style={{ transform }}
      >
        <Swatch style={activeStyle} />
        <Swatch style={{ fill: color }} />
      </button>
      <style jsx>{`
        .color-swatch-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          cursor: pointer;
          width: 2rem;
          height: 2rem;
          border: 0;
          background: transparent;
          border-radius: 50%;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
        }

        .color-swatch-button:hover {
          transform: scale(1.25) !important;
        }

        .swatch-active {
          position: absolute;
          transform: scale(0.2);
        }
      `}</style>
    </>
  );
};

export default ColorPicker;
