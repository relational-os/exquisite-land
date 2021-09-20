import React, { useState } from 'react';
import Button, { ButtonSuccess } from '@app/components/Button';
import useEditor from '@app/hooks/use-editor';
import { Tool } from '@app/features/State';

interface EditorProps {
  x: number;
  y: number;
  closeModal: () => void;
}

const SIZE = 18;
const columns = Array.from(Array(32).keys());
const rows = Array.from(Array(32).keys());

const MAX = 32;
const EMPTY = Array(32)
  .fill(0)
  .map(() => Array(32).fill(13));

const Editor = ({ x, y, closeModal }: EditorProps) => {
  const [drawing, setDrawing] = useState(false);
  const [pixels, setPixels] = useState<number[][]>(EMPTY);
  const {
    palette,
    activeColor,
    setActiveColor,
    setTile,
    activeTool,
    prevTool,
    setActiveTool,
    getActiveCursor
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
    if (x + 1 < MAX) {
      d = paintNeighbors(color, startColor, x + 1, y, d, checked);
    }
    if (x - 1 >= 0) {
      d = paintNeighbors(color, startColor, x - 1, y, d, checked);
    }
    if (y + 1 < MAX) {
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
    setPixels([]);
  };

  const handleSave = async () => {
    setTile({ x, y, pixels });
    closeModal();
  };

  const paintPixels = (rawX: number, rawY: number) => {
    const elem = document.elementFromPoint(rawX, rawY);
    if (!elem) return;
    if (!elem.getAttribute('class')?.includes('box')) return;

    const [x, y] = elem
      .getAttribute('id')!
      .split('_')
      .map(n => parseInt(n));

    if (activeTool == Tool.BRUSH) {
      elem.setAttribute('style', `background-color: ${palette[activeColor]}`);
      setPixels(pixels => {
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
        onPointerDown={e => {
          setDrawing(true);
        }}
        onPointerUp={() => setDrawing(false)}
      >
        {columns.map(y => {
          return rows.map(x => {
            return (
              <div
                id={`${x}_${y}`}
                key={`${x}_${y}`}
                className="box"
                style={{ backgroundColor: palette[pixels?.[x]?.[y]] }}
                onPointerEnter={e => onMouseEnter(e, x, y)}
                onMouseDown={e => onMouseEnter(e, x, y)}
                onMouseOver={e => onMouseEnter(e, x, y)}
                onTouchMove={e => {
                  touchEnter(e);
                }}
                onTouchStart={e => {
                  touchEnter(e);
                }}
              ></div>
            );
          });
        })}
      </div>

      <div className="canvas-aside-left">
        {Object.keys(Tool).map((tool, i) => {
          return (
            <Button key={i} onClick={e => setActiveTool(tool as Tool)}>
              {activeTool == tool ? `*${tool}*` : `${tool}`}
            </Button>
          );
        })}
        <Button>UNDO</Button>
        <div className="color-palette">
          {palette.map(color => {
            return (
              <div
                key={`${color}`}
                style={{
                  backgroundColor: color,
                  height: '24px',
                  width: '24px',
                  border: color == palette[activeColor] ? 'solid 1px black' : ''
                }}
                onClick={e => setActiveColor(color)}
              ></div>
            );
          })}
        </div>
      </div>

      <div className="canvas-aside-right">
        <div className="preview">
          {columns.map(y => {
            return rows.map(x => {
              return (
                <div
                  key={`${x}_${y}_preview`}
                  className="box-preview"
                  style={{
                    backgroundColor: palette[pixels?.[x]?.[y]]
                  }}
                ></div>
              );
            });
          })}
        </div>
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
          grid-template-columns: repeat(32, 1fr);
          width: ${rows.length * SIZE}px;
          height: ${columns.length * SIZE}px;
          user-select: none;
          touch-action: none;
          cursor: ${getActiveCursor()};
          border: 1px solid #000;
        }
        .box {
          width: ${SIZE}px;
          height: ${SIZE}px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-width: 0 1px 1px 0;
        }
        .box-preview {
          width: 3.85px;
          height: 3.85px;
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
            'aside-left canvas aside-right'
            'aside-left canvas-footer aside-right';
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
          display: grid;
          grid-template-columns: repeat(32, 1fr);
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
