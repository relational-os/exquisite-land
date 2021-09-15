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
          flex-direction: column;
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
  const transform = isActive ? "scale(1.25)" : "scale(1)";

  return (
    <>
      <button
        className="brush-button"
        onClick={() => setBrush(type)}
        style={{ transform }}
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
          will-change: transform;
          transition: transform 0.2s ease-in-out;
        }

        .brush-button:hover {
          transform: scale(1.25) !important;
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
