import React, { useState } from 'react';
import Button, { ButtonSuccess } from '@app/components/Button';
import useEditor, { Pixels } from '@app/hooks/use-editor';
import { Tool } from '@app/features/State';
import Icon from './Icon';
import EditorPreview from './EditorPreview';
import TileSVG from '../canvas/TileSVG';
import update from 'immutability-helper';
import { useDebouncedCallback } from 'use-debounce';
import { generateTokenID, getSVGFromPixels } from '@app/features/TileUtils';
import useTile from '@app/features/useTile';
import { useLocalStorage } from 'react-use';

interface EditorProps {
  x: number;
  y: number;
  closeModal: () => void;
  hideControls?: boolean;
  hideMinimap?: boolean;
}

const MAX = 32;
const PIXEL_SIZE = 18;

const columns = Array.from(Array(MAX).keys());
const rows = Array.from(Array(MAX).keys());

const EMPTY: Pixels = columns.map(() => rows.map(() => 13));

const Editor = ({
  x,
  y,
  closeModal,
  hideControls,
  hideMinimap
}: EditorProps) => {
  const [drawing, setDrawing] = useState(false);
  const { refresh } = useTile(generateTokenID(x, y));
  // TODO: add contract address or other ID to localStorage key so cache is cleared per canvas
  const [pixelsCache, setPixelsCache] = useLocalStorage<Pixels>(
    `${x},${y}`,
    EMPTY
  );
  const [pixels, setPixels] = useState<Pixels>(pixelsCache || EMPTY);
  const [pixelsHistory, setPixelsHistory] = useState<Pixels[]>([
    pixelsCache || EMPTY
  ]);
  const addPixelsToHistory = useDebouncedCallback((newPixels: Pixels) => {
    setPixelsHistory([newPixels, ...pixelsHistory]);
    setPixelsCache(newPixels);
  }, 500);

  const {
    palette,
    activeColor,
    setActiveColor,
    submitTile,
    signToSubmitTile,
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
    d: Pixels,
    checked: Record<string, boolean> = {}
  ) => {
    if (color == startColor) return d;
    if (x < 0 || x >= MAX) return d;
    if (y < 0 || y >= MAX) return d;

    const key = `${x},${y}`;
    // If we've already checked this pixel don't check again
    if (checked[key]) return d;

    // if this is no longer the same color stop checking
    if (d[x][y] !== startColor) return d;

    // TODO: set up a linter to prevent mutating arguments?

    // paint this pixels color
    d = update(d, { [x]: { [y]: { $set: color } } });

    // paint each adjacent pixel
    d = paintNeighbors(color, startColor, x + 1, y, d, checked);
    d = paintNeighbors(color, startColor, x - 1, y, d, checked);
    d = paintNeighbors(color, startColor, x, y + 1, d, checked);
    d = paintNeighbors(color, startColor, x, y - 1, d, checked);

    // Since we've just checked this one, make sure we don't check it again
    checked[key] = true;

    return d;
  };

  const handleClear = () => {
    setPixelsHistory([EMPTY]);
    setPixels(EMPTY);
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
      const newPixels = update(pixels, { [x]: { [y]: { $set: activeColor } } });
      setPixels(newPixels);
      addPixelsToHistory(newPixels);
    } else if (activeTool == Tool.EYEDROPPER) {
      setActiveColor(palette[pixels[x][y]]);
      setActiveTool(prevTool);
    } else if (activeTool == Tool.BUCKET) {
      const newPixels = paintNeighbors(activeColor, pixels[x][y], x, y, pixels);
      setPixels(newPixels);
      addPixelsToHistory(newPixels);
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

  // * PUBLISHING FLOW * //
  const [isConfirming, setConfirming] = useState(false);
  const [isSigning, setSigning] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [isFinishedSubmitting, setFinishedSubmitting] = useState(false);
  const onPublishClick = async () => {
    setConfirming(true);
  };
  const onConfirmPublish = async () => {
    setSigning(true);
    try {
      const { dataToSign, signature } = await signToSubmitTile({
        x,
        y,
        pixels
      });
      setSubmitting(true);
      const tx = await submitTile({ x, y, pixels, dataToSign, signature });
      setTxHash(tx.hash);
      await tx.wait(2);
      setFinishedSubmitting(true);
      setTimeout(async () => {
        refresh();
        closeModal();
        setTimeout(() => {
          refresh();
        }, 3000);
      }, 3000);
    } catch (err) {
      setSigning(false);
    }
  };
  const onCancelPublish = async () => {
    setConfirming(false);
  };

  if (isConfirming)
    return (
      <div className="modal">
        {isFinishedSubmitting ? (
          <div className="message">Done!</div>
        ) : isSubmitting ? (
          <>
            <div className="message">Submitting...</div>
            {txHash && (
              <div className="message">
                <a
                  target="_blank"
                  href={`https://polygonscan.com/tx/${txHash}`}
                >
                  View on PolygonScan ↗
                </a>
              </div>
            )}
          </>
        ) : isSigning ? (
          <div className="message">Sign the message in your wallet...</div>
        ) : (
          <>
            <svg
              width="100"
              height="100"
              dangerouslySetInnerHTML={{ __html: getSVGFromPixels(pixels) }}
              className="preview"
            />
            <div className="message">Pixels are permanent.</div>
            <div className="message">Are you sure?</div>

            <div className="buttons">
              <Button onClick={onCancelPublish}>Cancel</Button>
              <ButtonSuccess onClick={onConfirmPublish}>
                &nbsp;&nbsp;
                <img src="/graphics/icon-mint.svg" className="mint" /> Mint
                &nbsp;&nbsp;
              </ButtonSuccess>
            </div>
          </>
        )}
        <style jsx>{`
          .modal {
            background-color: #201e1e;
            width: 90vw;
            max-width: 600px;
            height: 90vh;
            max-height: 600px;
            display: flex;
            flex-direction: column;
            gap: 30px;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            padding: 20px;
          }
          .buttons {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .buttons .mint {
            width: 16px;
            margin-bottom: -2px;
          }
          .preview {
            width: 45%;
            height: auto;
          }
          a {
            color: inherit;
          }
        `}</style>
      </div>
    );

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
          onMouseLeave={() => setDrawing(false)}
          onPointerLeave={() => setDrawing(false)}
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

        {!hideMinimap && (
          <>
            <div className="peek-north">
              <TileSVG
                x={x - 1}
                y={y - 1}
                viewbox={'30 29.5 32 32'}
                style={{
                  height: `${PIXEL_SIZE * 2}px`,
                  width: `${PIXEL_SIZE * 2}px`
                }}
                svgWidth={`${PIXEL_SIZE * 32}px`}
              ></TileSVG>
              <TileSVG
                x={x}
                y={y - 1}
                viewbox={'0 29.5 32 32'}
                style={{
                  height: `${PIXEL_SIZE * 2}px`,
                  width: `${PIXEL_SIZE * 32}px`
                }}
              ></TileSVG>
              <TileSVG
                x={x + 1}
                y={y - 1}
                viewbox={'0 29.5 32 32'}
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
                viewbox={'30 -0.5 32 32'}
                style={{
                  height: `${PIXEL_SIZE * 2}px`,
                  width: `${PIXEL_SIZE * 2}px`
                }}
                svgHeight={`${PIXEL_SIZE * 32}px`}
              ></TileSVG>
              <TileSVG
                x={x}
                y={y + 1}
                viewbox={'0 -0.5 32 32'}
                style={{
                  height: `${PIXEL_SIZE * 2}px`,
                  width: `${PIXEL_SIZE * 32}px`
                }}
              ></TileSVG>
              <TileSVG
                x={x + 1}
                y={y + 1}
                viewbox={'0 -0.5 32 32'}
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
                viewbox={'30 -0.5 32 32'}
                svgHeight={`${PIXEL_SIZE * 32}px`}
              ></TileSVG>
            </div>
            <div className="peek-east">
              <TileSVG
                x={x + 1}
                y={y}
                viewbox={'0 -0.5 32 32'}
                svgHeight={`${PIXEL_SIZE * 32}px`}
              ></TileSVG>
            </div>
          </>
        )}
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
            <button
              className="undo"
              disabled={!pixelsHistory.length || pixelsHistory[0] === EMPTY}
              onClick={() => {
                const [_pixels, ...prevPixelsHistory] = pixelsHistory;
                setPixelsHistory(prevPixelsHistory);
                setPixels(prevPixelsHistory[0] || EMPTY);
              }}
            >
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

      {!hideMinimap && (
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
      )}

      {!hideControls && (
        <div className="canvas-footer">
          <Button onClick={handleClear}>Clear</Button>
          <div className="canvas-footer-right">
            <Button onClick={closeModal}>Cancel</Button>
            <ButtonSuccess onClick={onPublishClick}>Mint</ButtonSuccess>
          </div>
        </div>
      )}

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
          flex: 1 1 auto;
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
          display: ${!hideMinimap ? 'grid' : 'block'};
          grid-template-columns: 36px auto 36px;
          grid-template-rows: 36px auto 31px;
          gap: 0px 0px;
          grid-template-areas:
            'peek-north peek-north peek-north'
            'peek-west canvas peek-east'
            'peek-south peek-south peek-south';
          background: #333;
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
          border: 4px solid #201e1e;
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
          background: #201e1e;
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
        .toolbar button:hover:not([disabled]) {
          background: #1b1919;
          opacity: 0.9;
        }
        .toolbar button[disabled] {
          cursor: not-allowed;
          opacity: 0.2;
        }
        .toolbar button.active {
          opacity: 1;
          background: #1b1919;
        }

        .brush,
        .bucket,
        .eyedropper,
        .undo {
          fill: #fff;
        }

        .undo:disabled:hover {
          cursor: pointer;
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
