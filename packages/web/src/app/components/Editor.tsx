import React, { useEffect, useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import useEditor, { BrushType } from "@app/hooks/use-editor";
import ColorPicker from "@app/components/ColorPicker";
import BrushPicker from "@app/components/BrushPicker";
import Inkwell from "@app/components/Inkwell";
import Button, { ButtonSuccess } from "@app/components/Button";

interface EditorProps {
  x: number;
  y: number;
  closeModal: () => void;
}

const INKWELL_CAPACITY = 1000;

const Editor = ({ x, y, closeModal }: EditorProps) => {
  const { brush, brushColor, brushSize, setTile } = useEditor();
  const [inkUsed, setInkUsed] = React.useState(0);
  const isEraseMode = brush === BrushType.ERASER;
  const color = isEraseMode ? "pink" : brushColor;
  const fillColor = color.replace("#", "%23");

  const canvasRef = useRef<ReactSketchCanvas>(null);
  const canvasStyle = {}; // drop border style

  // prettier-ignore
  const circleSVG = `'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewbox="0 0 32 32" width="32" height="32"><circle r="${brushSize / 2}" cx="16" cy="16" fill="${fillColor}"/></svg>'`;
  const cursorOffset = 14; // this should be 16 to center the pointer, unclear why it's off by 2

  function handleClear() {
    canvasRef.current?.resetCanvas();
  }

  async function handleSave() {
    if (!canvasRef.current) return;
    const svg = await canvasRef.current.exportSvg();
    if (!svg) return;

    const optimizedSvg = await fetch("/api/optimize", {
      method: "POST",
      body: svg,
    })
      .then((res) => res.json())
      .then((s) => s.data as string);

    const paths = await canvasRef.current.exportPaths();
    setTile({ x, y, svg: optimizedSvg, paths });
    closeModal();
  }

  useEffect(() => {
    canvasRef.current?.eraseMode(isEraseMode);
  }, [brush]);

  useEffect(() => {
    async function loadPaths() {
      const paths = await canvasRef.current?.exportPaths();
      console.log("paths", paths);
      // setCanvasPaths(paths || null);
    }
    loadPaths();
  }, [canvasRef.current]);

  return (
    <div className="editor">
      <div className="canvas">
        <ReactSketchCanvas
          ref={canvasRef}
          height="600px"
          width="600px"
          strokeWidth={brushSize}
          eraserWidth={brushSize}
          strokeColor={brushColor}
          onUpdate={(paths) => {
            const pointCount = paths.reduce((acc, path) => {
              return (acc += path.paths.length);
            }, 0);
            setInkUsed(pointCount);
          }}
          style={canvasStyle}
        />
      </div>

      <div className="canvas-aside-left">
        <BrushPicker />
        <ColorPicker />
      </div>

      <div className="canvas-aside-right">
        <Inkwell value={(INKWELL_CAPACITY - inkUsed) / INKWELL_CAPACITY} />
      </div>

      <div className="canvas-footer">
        <div className="canvas-footer-left">
          {/* <Button style={{ width: 35 }} disabled>
            i
          </Button> */}
        </div>
        <div className="canvas-footer-right">
          <Button onClick={handleClear}>Clear</Button>
          <ButtonSuccess onClick={handleSave}>Save</ButtonSuccess>
        </div>
      </div>

      <style jsx>{`
        .editor {
          display: grid;
          grid-template-columns: 64px 600px 64px;
          grid-template-rows: 600px 64px;
          grid-template-areas:
            "aside-left canvas aside-right"
            "aside-left canvas-footer aside-right";
        }

        .canvas {
          overflow: hidden;
          grid-area: canvas;
          cursor: url(${circleSVG}) ${cursorOffset} ${cursorOffset}, auto;
          border: 2px solid hsl(0deg 0% 80%);
        }

        .canvas-aside-left,
        .canvas-aside-right {
          display: flex;
          padding: 16px 0;
          flex-direction: column;
          gap: 24px;
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
