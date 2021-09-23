import React, { useState } from "react";
import Button, { ButtonSuccess } from "@app/components/Button";
import useEditor from "@app/hooks/use-editor";
import { Tool } from "@app/features/State";
import EditorPreview from "./EditorPreview";
import TileSVG from "../canvas/TileSVG";

interface EditorProps {
  x: number;
  y: number;
  closeModal: () => void;
}

const DRAWING_SURFACE_SIZE = 32;
const EDITOR_NUM_PIXELS = DRAWING_SURFACE_SIZE;
const PIXEL_SIZE = 18;

const emptyBoard = () => {
  return Array(EDITOR_NUM_PIXELS)
    .fill(0)
    .map(() => Array(EDITOR_NUM_PIXELS).fill(13));
};

const columns = Array.from(Array(EDITOR_NUM_PIXELS).keys());
const rows = Array.from(Array(EDITOR_NUM_PIXELS).keys());

const Editor = ({ x, y, closeModal }: EditorProps) => {
  const [drawing, setDrawing] = useState(false);
  const [pixels, setPixels] = useState<number[][]>(emptyBoard());
  const {
    palette,
    activeColor,
    setActiveColor,
    setTile,
    activeTool,
    prevTool,
    setActiveTool,
    getActiveCursor,
    activeBrushSize,
    setActiveBrushSize,
  } = useEditor();

  const paintNeighbors = (
    color: number,
    startColor: number,
    x: number,
    y: number,
    d: number[][],
    checked: Record<string, boolean>
  ) => {
    // If we've already checked this pixel don't check again
    if (checked[`${x}-${y}`]) return d;

    // if this is no longer the same color stop checking
    if (pixels[x][y] != startColor) return d;

    // paint this pixels color
    d[x][y] = color;

    // Find Neighbors and add them to the stack
    if (x + 1 < DRAWING_SURFACE_SIZE) {
      d = paintNeighbors(color, startColor, x + 1, y, d, checked);
    }
    if (x - 1 >= 0) {
      d = paintNeighbors(color, startColor, x - 1, y, d, checked);
    }
    if (y + 1 < DRAWING_SURFACE_SIZE) {
      d = paintNeighbors(color, startColor, x, y + 1, d, checked);
    }
    if (y - 1 >= 0) {
      d = paintNeighbors(color, startColor, x, y - 1, d, checked);
    }

    // Since we've just checked this one, make sure we don't check it again
    checked[`${x}-${y}`] = true;

    return d;
  };

  const handleClear = () => {
    setPixels(emptyBoard());
  };

  const handleSave = async () => {
    setTile({ x, y, pixels });
    closeModal();
  };

  const paintPixels = (rawX: number, rawY: number) => {
    const elem = document.elementFromPoint(rawX, rawY);
    if (!elem) return;
    if (!elem.getAttribute("class")?.includes("box")) return;

    const [x, y] = elem
      .getAttribute("id")!
      .split("_")
      .map((n) => parseInt(n));

    if (activeTool == Tool.BRUSH) {
      elem.setAttribute("style", `background-color: ${palette[activeColor]}`);
      setPixels((pixels) => {
        if (!pixels[x]) {
          pixels[x] = [];
        }
        pixels[x][y] = activeColor;

        return pixels;
      });
    } else if (activeTool == Tool.EYEDROPPER) {
      console.log(prevTool);
      setActiveColor(palette[pixels[x][y]]);
      setActiveTool(prevTool);
    } else if (activeTool == Tool.BUCKET) {
      const d = paintNeighbors(activeColor, pixels[x][y], x, y, pixels, {});
      setPixels(d);
    }
  };

  // TODO: break these out into functions
  const touchEnter = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!drawing) return;
    e.preventDefault();

    paintPixels(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    if (!drawing) return;
    e.preventDefault();

    paintPixels(e.clientX, e.clientY);
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

      <div className="canvas-header">
        <TileSVG
          x={x}
          y={y - 1}
          viewbox={"0 30 32 32"}
          style={{ height: `${PIXEL_SIZE * 2}px` }}
        ></TileSVG>
      </div>

      <div className="canvas-aside-left">
        <div className="brush-palette">
          <Button onClick={(e) => setActiveTool(Tool.BRUSH)}>
            {activeTool == Tool.BRUSH ? `*${Tool.BRUSH}*` : `${Tool.BRUSH}`}
          </Button>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              fontSize: "28px",
              paddingTop: "1rem",
            }}
          >
            <div
              style={{ color: "#555" }}
              onClick={() => setActiveBrushSize(activeBrushSize - 1)}
            >
              -
            </div>
            <div style={{ paddingLeft: ".5rem", paddingRight: ".5rem" }}>
              {activeBrushSize}
            </div>
            <div
              style={{ color: "#555" }}
              onClick={() => setActiveBrushSize(activeBrushSize + 1)}
            >
              +
            </div>
          </div>
        </div>
        {Object.keys(Tool).map((tool, i) => {
          if (tool != "BRUSH")
            return (
              <Button key={i} onClick={(e) => setActiveTool(tool as Tool)}>
                {activeTool == tool ? `*${tool}*` : `${tool}`}
              </Button>
            );
        })}
        <Button>UNDO</Button>
        <div className="color-palette">
          {palette.map((color) => {
            return (
              <div
                key={`${color}`}
                style={{
                  backgroundColor: color,
                  height: "24px",
                  width: "24px",
                  border:
                    color == palette[activeColor] ? "solid 1px black" : "",
                }}
                onClick={(e) => setActiveColor(color)}
              ></div>
            );
          })}
        </div>
      </div>

      <div className="canvas-aside-right">
        <EditorPreview
          pixels={pixels}
          y={y}
          x={x}
          columns={columns}
          rows={rows}
        ></EditorPreview>
      </div>

      <div className="canvas-footer">
        <Button onClick={handleClear}>reset</Button>
        <div className="canvas-footer-right">
          <Button onClick={closeModal}>cancel</Button>
          <ButtonSuccess onClick={handleSave}>save</ButtonSuccess>
        </div>
      </div>

      <style jsx>{`
        .canvas {
          display: grid;
          grid-template-columns: repeat(${EDITOR_NUM_PIXELS}, 1fr);
          width: ${rows.length * PIXEL_SIZE}px;
          height: ${columns.length * PIXEL_SIZE}px;
          user-select: none;
          touch-action: none;
          cursor: ${getActiveCursor()};
          border: 1px solid #000;
        }
        .box {
          width: ${PIXEL_SIZE}px;
          height: ${PIXEL_SIZE}px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-width: 0 1px 1px 0;
        }
        .box:hover {
          background-color: #777;
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
          grid-template-columns: 150px auto 300px;
          grid-template-rows: 36px auto 64px;
          grid-template-areas:
            "aside-left canvas-header aside-right"
            "aside-left canvas aside-right"
            "aside-left canvas-footer aside-right";
        }

        .canvas-header {
          display: block;
          padding: 0;
          grid-area: canvas-header;
        }

        .canvas-aside-left {
          display: flex;
          padding: 0 14px;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          grid-area: aside-left;
        }

        .canvas-aside-right {
          display: flex;
          flex-direction: column;
          padding: 0 14px;
          grid-area: aside-right;
          align-items: flex-start;
          width: 60%;
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
          grid-area: canvas-footer;
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
