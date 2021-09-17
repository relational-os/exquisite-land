import React, { useState } from "react";
import Button, { ButtonSuccess } from "@app/components/Button";
import useEditor from "@app/hooks/use-editor";

interface EditorProps {
  x: number;
  y: number;
  closeModal: () => void;
}

const PIXEL_COUNT = 32;
const SIZE = 18;
const columns = Array.from(Array(32).keys());
const rows = Array.from(Array(32).keys());

const Editor = ({ x, y, closeModal }: EditorProps) => {
  const [drawing, setDrawing] = useState(false);
  const { palette, activeColor, setActiveColor, setTile } = useEditor();

  var m = Array(32)
    .fill(0)
    .map(() => Array(32).fill(13));

  const [pixels, setPixels] = useState<number[][]>(m);

  function handleClear() {
    setPixels([]);
  }

  async function handleSave() {
    setTile({ x, y, pixels });
    closeModal();
  }

  const touchEnter = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!drawing) return;
    e.preventDefault();

    const elem = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    );
    if (!elem) return;
    if (!elem.getAttribute("class")?.includes("box")) return;
    elem?.setAttribute("style", `background-color: ${activeColor}`);
    const [x, y] = elem
      .getAttribute("id")!
      .split("_")
      .map((n) => parseInt(n));

    elem?.setAttribute("style", `background-color: ${palette[activeColor]}`);

    setPixels((pixels) => {
      if (!pixels[x]) {
        pixels[x] = [];
      }
      pixels[x][y] = activeColor;

      return pixels;
    });

    console.log(e, x, y);
  };

  const onMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    if (!drawing) return;

    e.preventDefault();
    e.currentTarget.style.backgroundColor = palette[activeColor];

    setPixels((pixels) => {
      if (!pixels[x]) {
        pixels[x] = [];
      }
      pixels[x][y] = activeColor;
      return pixels;
    });
  };

  return (
    <div className="editor">
      <div
        className="canvas"
        draggable={false}
        onPointerDown={(e) => {
          setDrawing(true);
        }}
        onPointerUp={() => setDrawing(false)}
      >
        {columns.map((y) => {
          return rows.map((x) => {
            return (
              <div
                id={`${x}_${y}`}
                key={`${x}_${y}`}
                className="box"
                style={{ backgroundColor: palette[pixels?.[x]?.[y]] }}
                onPointerEnter={(e) => onMouseEnter(e, x, y)}
                onMouseDown={(e) => onMouseEnter(e, x, y)}
                onMouseOver={(e) => onMouseEnter(e, x, y)}
                onTouchMove={(e) => {
                  touchEnter(e);
                }}
                onTouchStart={(e) => {
                  touchEnter(e);
                }}
              ></div>
            );
          });
        })}
      </div>

      <div className="canvas-aside-left">
        <div className="color-palette">
          {palette.map((color) => {
            return (
              <div
                key={`${color}`}
                style={{
                  backgroundColor: color,
                  height: "24px",
                  width: "24px",
                }}
                onClick={(e) => setActiveColor(color)}
              ></div>
            );
          })}
        </div>
      </div>

      <div className="canvas-aside-right">
        <div className="preview"></div>
      </div>

      <div className="canvas-footer">
        <Button onClick={handleClear}>reset</Button>
        <div className="canvas-footer-right">
          <Button>cancel</Button>
          <ButtonSuccess onClick={handleSave}>save</ButtonSuccess>
        </div>
      </div>

      <style jsx>{`
        .canvas {
          display: grid;
          grid-template-columns: repeat(32, 1fr);
          width: ${rows.length * SIZE}px;
          height: ${columns.length * SIZE}px;
          user-select: none;
          touch-action: none;
          cursor: cell;
          border: 1px solid #000;
        }
        .box {
          width: ${SIZE}px;
          height: ${SIZE}px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-width: 0 1px 1px 0;
        }
        .editor {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          margin: 2rem;
        }

        .editor {
          display: grid;
          grid-template-columns: 150px auto 150px;
          grid-template-rows: auto 64px;
          grid-template-areas:
            "aside-left canvas aside-right"
            "aside-left canvas-footer aside-right";
        }

        .canvas-aside-left,
        .canvas-aside-right {
          display: flex;
          padding: 0 14px;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        .canvas-aside-left {
          grid-area: aside-left;
        }

        .canvas-aside-right {
          display: grid;
          grid-area: aside-right;
          align-items: flex-start;
          width: 30%;
        }

        .canvas-footer {
          display: flex;
          padding: 0;
          align-items: center;
          justify-content: space-between;
          grid-area: canvas-footer;
          box-sizing: border-box;
          margin-top: 14px;
        }

        .canvas-footer-right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          justify-content: stretch;
          width: 200px;
          gap: 8px;
        }

        .preview {
          width: 128px;
          height: 128px;
          border: 2px solid #b2bfd0;
          border-radius: 4px;
          image-rendering: pixelated;
        }

        .color-palette {
          display: grid;
          grid-template-columns: 50% 50%;
          grid-gap: 5px;
          column-gap: 3px;
          margin-left: 62px;
        }

        .tool-bar {
        }
      `}</style>
    </div>
  );
};

export default Editor;
