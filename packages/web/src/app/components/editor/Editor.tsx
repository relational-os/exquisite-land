import React, { useState } from 'react';
import Button, { ButtonSuccess } from '@app/components/Button';
import useEditor from '@app/hooks/use-editor';
import { Tool } from '@app/features/State';
import Icon from './Icon';
import EditorPreview from './EditorPreview';
import TileSVG from '../canvas/TileSVG';

interface EditorProps {
  x: number;
  y: number;
  closeModal: () => void;
}

const emptyBoard = () => {
  return Array(32)
    .fill(0)
    .map(() => Array(32).fill(13));
};

const PIXEL_SIZE = 18;
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
    console.log(EMPTY);
    setPixels(emptyBoard());
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
      .map((n) => parseInt(n));

    if (activeTool == Tool.BRUSH) {
      elem.setAttribute('style', `background-color: ${palette[activeColor]}`);
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
      <div className="canvas-peek">
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

        <div className="peek-north">
          <TileSVG
            x={x - 1}
            y={y - 1}
            viewbox={'30 30 32 32'}
            style={{
              height: `${PIXEL_SIZE * 2}px`,
              width: `${PIXEL_SIZE * 2}px`
            }}
            svgWidth={`${PIXEL_SIZE * 32}px`}
          ></TileSVG>
          <TileSVG
            x={x}
            y={y - 1}
            viewbox={'0 30 32 32'}
            style={{
              height: `${PIXEL_SIZE * 2}px`,
              width: `${PIXEL_SIZE * 32}px`
            }}
          ></TileSVG>
          <TileSVG
            x={x + 1}
            y={y - 1}
            viewbox={'0 30 32 32'}
            style={{
              height: `${PIXEL_SIZE * 2}px`,
              width: `${PIXEL_SIZE * 2}px`
            }}
            svgWidth={`${PIXEL_SIZE * 32}px`}
          ></TileSVG>
        </div>

        <div className="peek-south">
          <TileSVG
            x={x - 1}
            y={y + 1}
            viewbox={'30 0 32 32'}
            style={{
              height: `${PIXEL_SIZE * 2}px`,
              width: `${PIXEL_SIZE * 2}px`
            }}
            svgHeight={`${PIXEL_SIZE * 32}px`}
          ></TileSVG>
          <TileSVG
            x={x}
            y={y + 1}
            viewbox={'0 0 32 32'}
            style={{
              height: `${PIXEL_SIZE * 2}px`,
              width: `${PIXEL_SIZE * 32}px`
            }}
          ></TileSVG>
          <TileSVG
            x={x + 1}
            y={y + 1}
            viewbox={'0 0 32 32'}
            style={{
              height: `${PIXEL_SIZE * 2}px`,
              width: `${PIXEL_SIZE * 2}px`
            }}
            svgHeight={`${PIXEL_SIZE * 32}px`}
          ></TileSVG>
        </div>

        <div className="peek-west">
          <TileSVG
            x={x - 1}
            y={y}
            viewbox={'30 0 32 32'}
            svgHeight={`${PIXEL_SIZE * 32}px`}
          ></TileSVG>
        </div>
        <div className="peek-east">
          <TileSVG
            x={x + 1}
            y={y}
            viewbox={'0 0 32 32'}
            svgHeight={`${PIXEL_SIZE * 32}px`}
          ></TileSVG>
        </div>
      </div>

      <div className="canvas-aside-left">
        <div className="tool-container">
          <div className="toolbar">
            <button
              onClick={(e) => setActiveTool(Tool.BRUSH)}
              className={
                activeTool == Tool.BRUSH ? `active brush` : `` + ' brush'
              }
            >
              <Icon
                name="brush"
                style={{
                  width: '30px',
                  height: 'auto',
                  fill: '#fff'
                }}
              />
            </button>
            <button
              onClick={(e) => setActiveTool(Tool.BUCKET)}
              className={
                activeTool == Tool.BUCKET ? `active bucket` : `` + ' bucket'
              }
            >
              <Icon
                name="bucket"
                style={{
                  width: '34px',
                  height: 'auto'
                }}
              />
            </button>
            <button
              onClick={(e) => setActiveTool(Tool.EYEDROPPER)}
              className={
                activeTool == Tool.EYEDROPPER
                  ? `active eyedropper`
                  : `` + ' eyedropper'
              }
            >
              <Icon
                name="eyedropper"
                style={{
                  width: '22px',
                  height: 'auto'
                }}
              />
            </button>
            <button className="undo">
              <Icon
                name="undo"
                style={{
                  width: '32px',
                  height: 'auto'
                }}
              />
            </button>
          </div>

          <div className="color-palette">
            {palette.map((color) => {
              return (
                <div
                  key={`${color}`}
                  className={color == palette[activeColor] ? 'active' : ''}
                  style={{
                    backgroundColor: color
                  }}
                  onClick={(e) => setActiveColor(color)}
                ></div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="canvas-aside-right">
        <div className="preview-minimap">
          <EditorPreview
            pixels={pixels}
            y={y}
            x={x}
            columns={columns}
            rows={rows}
          ></EditorPreview>
        </div>
      </div>

      <div className="canvas-footer">
        <Button onClick={handleClear}>reset</Button>
        <div className="canvas-footer-right">
          <Button onClick={closeModal}>cancel</Button>
          <ButtonSuccess onClick={handleSave}>publish</ButtonSuccess>
        </div>
      </div>

      <style jsx>{`
        .canvas {
          display: grid;
          grid-template-columns: repeat(32, 1fr);
          width: ${rows.length * PIXEL_SIZE}px;
          height: ${columns.length * PIXEL_SIZE}px;
          user-select: none;
          touch-action: none;
          cursor: ${getActiveCursor()};
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
        .box-preview {
          width: 3px;
          height: 3px;
        }

        .editor {
          display: grid;
          grid-template-columns: auto auto auto;
          grid-template-rows: auto;
          grid-template-areas:
            'aside-left canvas aside-right'
            'aside-left canvas-footer aside-right';
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          margin: 2rem;
        }

        .canvas-aside-left {
          display: flex;
          flex-direction: column;
          gap: 0;
          align-items: center;
          grid-area: aside-left;
          margin-left: 3rem;
        }
        .canvas-aside-right {
          display: flex;
          flex-direction: column;
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
        }

        .canvas-peek {
          display: grid;
          grid-template-columns: 36px auto 36px;
          grid-template-rows: 36px auto 31px;
          gap: 0px 0px;
          grid-template-areas:
            'peek-north peek-north peek-north'
            'peek-west canvas peek-east'
            'peek-south peek-south peek-south';
          background: #eee;
          border-radius: 4px;
        }
        .peek-north {
          grid-area: peek-north;
          display: flex;
        }
        .peek-south {
          grid-area: peek-south;
          display: flex;
          margin-top: -4px;
        }
        .peek-west {
          grid-area: peek-west;
        }
        .peek-east {
          grid-area: peek-east;
        }

        .preview-minimap {
          margin-left: 1rem;
          border: 4px solid #222;
        }
        .preview-minimap > div {
          display: flex;
        }
        .preview {
          width: 96px;
          height: 96px;
          image-rendering: pixelated;
          display: grid;
          grid-template-columns: repeat(32, 1fr);
          background: #fff;
        }

        .tool-container {
          margin-right: 1rem;
          padding: 0.7rem;
          background: #222;
          border-radius: ;
        }

        .toolbar {
          display: flex;
          flex-direction: column;
          margin-bottom: 2rem;
        }

        .toolbar button {
          padding: 10px 12px;
          background: transparent;
          outline: none;
          border: none;
          opacity: 0.5;
          cursor: pointer;
        }
        .toolbar button:hover {
          background: #111;
          opacity: 0.9;
        }
        .toolbar button.active {
          opacity: 1;
          background: #111;
        }

        .brush,
        .bucket,
        .eyedropper,
        .undo {
          fill: #fff;
        }

        .color-palette {
          display: grid;
          grid-template-columns: 50% 50%;
          grid-gap: 1px;
          column-gap: 0px;
        }

        .color-palette div {
          position: relative;
          width: 28px;
          height: 28px;
          cursor: pointer;
        }

        .color-palette .active::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 8px;
          height: 8px;
          background: #000;
        }
      `}</style>
    </div>
  );
};

export default Editor;
