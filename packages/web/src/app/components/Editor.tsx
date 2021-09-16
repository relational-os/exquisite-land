import React, { useEffect, useRef, useState } from "react";
import useEditor, { BrushType } from "@app/hooks/use-editor";
import ColorPicker from "@app/components/ColorPicker";
import BrushPicker from "@app/components/BrushPicker";
import Inkwell from "@app/components/Inkwell";
import Button, { ButtonSuccess } from "@app/components/Button";
import PALETTES from "src/constants/Palettes";

interface EditorProps {
  x: number;
  y: number;
  closeModal: () => void;
}

const SIZE = 20;
const columns = Array.from(Array(32).keys());
const rows = Array.from(Array(32).keys());
const palette = PALETTES[0];

const Editor = ({ x, y, closeModal }: EditorProps) => {
  const [drawing, setDrawing] = useState(false);
  const [pixels, setPixels] = useState<string[][]>([]);
  const [activeColor, setActiveColor] = useState("#B00B");

  function handleClear() {
    setPixels([]);
  }

  async function handleSave() {
    // setTile({ x, y, svg: optimizedSvg, paths });
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

    e.currentTarget.style.backgroundColor = activeColor;

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
    e.currentTarget.style.backgroundColor = activeColor;

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
      <div className="canvas">
        <div
          className="test"
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
                  style={{ backgroundColor: pixels?.[x]?.[y] }}
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
      </div>

      <div className="canvas-aside-left">
        {palette.map((color) => {
          return (
            <div
              style={{
                backgroundColor: color,
                height: "16px",
                width: "16px",
                border: "1px solid",
              }}
              onClick={(e) => setActiveColor(color)}
            ></div>
          );
        })}

        <Button onClick={handleClear}>Clear</Button>
        <ButtonSuccess onClick={handleSave}>Save</ButtonSuccess>
      </div>

      <style jsx>{`
        .test {
          display: grid;
          grid-template-columns: repeat(32, 1fr);
          width: ${rows.length * SIZE}px;
          height: ${columns.length * SIZE}px;
          user-select: none;
          touch-action: none;
        }
        .box {
          width: ${SIZE}px;
          height: ${SIZE}px;
          border: 1px solid #000;
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
          grid-template-columns: 64px 600px 64px;
          grid-template-rows: 600px 64px;
          grid-template-areas:
            "aside-left canvas aside-right"
            "aside-left canvas-footer aside-right";
        }

        .canvas-aside-left,
        .canvas-aside-right {
          display: flex;
          padding: 4px 0;
          flex-direction: column;
          gap: 4px;
          align-items: center;
        }

        .canvas-aside-left {
          grid-area: aside-left;
        }

        .canvas-aside-right {
          display: grid;
          height: 600px;
          grid-area: aside-right;
          place-content: center;
        }

        .canvas-footer {
          display: flex;
          padding: 16px;
          background: hsl(0deg 0% 97%);
          align-items: center;
          justify-content: space-between;
          grid-area: canvas-footer;
          border: 2px solid hsl(0deg 0% 80%);
          border-top: 0;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
        }

        .canvas-footer-right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          justify-content: stretch;
          width: 200px;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default Editor;
