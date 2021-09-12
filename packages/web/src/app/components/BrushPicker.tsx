import React from "react";
import useEditor, { BrushType } from "@app/hooks/use-editor";
import Icon from "@app/components/Icon";

const BrushPicker = () => {
  return (
    <>
      <div className="brush-picker">
        <Brush type={BrushType.PENCIL} />
        <Brush type={BrushType.PAINTBRUSH} />
        <Brush type={BrushType.ERASER} />
      </div>

      <style jsx>{`
        .brush-picker {
          display: flex;
          gap: 16px;
        }
      `}</style>
    </>
  );
};

interface BrushProps {
  type: BrushType;
}

const Brush = ({ type }: BrushProps) => {
  const { brush, setBrush } = useEditor();
  const isActive = type === brush;
  const color = isActive ? "dodgerblue" : "hsl(0deg 0% 20%)";
  const opacity = isActive ? 1 : 0.25;

  return (
    <>
      <button
        className="brush-button"
        onClick={() => setBrush(type)}
        style={{ color, opacity }}
      >
        <BrushIcon type={type} />
      </button>
      <style jsx>{`
        .brush-button {
          display: flex;
          margin: 0;
          padding: 2px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: 2rem;
          height: 2rem;
          border: 0;
          background: transparent;
          will-change: opacity, color, transform;
          transition: opacity 0.2s ease-in-out, color 0.2s ease-in-out,
            transform 0.2s ease-in-out;
        }

        .brush-button:hover {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
};

const BrushIcon = ({ type }: { type: BrushType }) => {
  switch (type) {
    case BrushType.PENCIL:
      return <Icon name="pencil" />;
    case BrushType.PAINTBRUSH:
      return <Icon name="paint-brush" />;
    case BrushType.ERASER:
      return <Icon name="eraser" />;
    default:
      return null;
  }
};

export default BrushPicker;
