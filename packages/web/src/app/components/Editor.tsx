import React, { useEffect, useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import useEditor, { BrushType } from "@app/hooks/use-editor";
import ColorPicker from "@app/components/ColorPicker";
import BrushPicker from "@app/components/BrushPicker";
import Button, { ButtonSuccess } from "@app/components/Button";

interface EditorProps {
  x: number;
  y: number;
  closeModal: () => void;
}

const PATH_DECIMAL_MODIFIER = 1000;

const Editor = ({ x, y, closeModal }: EditorProps) => {
  const { palette, brush, brushColor, brushSize, setTile } = useEditor();
  const isEraseMode = brush === BrushType.ERASER;
  const color = isEraseMode ? "pink" : brushColor;
  const fillColor = color.replace("#", "%23");

  // prettier-ignore
  const circleSVG = `'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewbox="0 0 32 32" width="32" height="32"><circle r="${brushSize / 2}" cx="16" cy="16" fill="${fillColor}"/></svg>'`;
  const cursorOffset = 14; // this should be 16 to center the pointer, unclear why it's off by 2

  function handleClear() {
    canvasRef.current?.resetCanvas();
  }

  async function handleSave() {
    if (!canvasRef.current) return;

    let svg = await canvasRef.current.exportSvg();
    let paths = await canvasRef.current.exportPaths();

    console.log("paths", paths);

    const paletteMap = palette.reduce(
      (previous: Record<string, number>, hex: string, index: number) => {
        previous[hex] = index;
        return previous;
      },
      {}
    );

    // TODO: add to SOL contract
    const strokeMap: Record<number, number> = { 4: 0, 16: 1 };

    let packagedPaths = paths.map((path) => {
      let strokeColor = path.strokeColor;
      let strokeWidth = path.strokeWidth;
      let strokePaths = path.paths;

      let outputPaths = strokePaths.map((strokePath) => [
        strokePath.x * PATH_DECIMAL_MODIFIER,
        strokePath.y * PATH_DECIMAL_MODIFIER,
      ]);

      return {
        strokeColor: paletteMap[strokeColor],
        strokeWidth: strokeMap[strokeWidth],
        paths: outputPaths,
      };
    });

    console.log("packagedPaths", packagedPaths);

    setTile({ x, y, svg });
    closeModal();
  }
  const canvasRef = useRef<ReactSketchCanvas>(null);
  const canvasStyle = {}; // drop border style

  useEffect(() => {
    canvasRef.current?.eraseMode(isEraseMode);
  }, [brush]);

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
          style={canvasStyle}
        />
      </div>

      <div className="canvas-controls">
        <ColorPicker />
        <BrushPicker />

        <div className="canvas-buttons">
          <Button onClick={handleClear}>Clear</Button>
          <ButtonSuccess onClick={handleSave}>Save</ButtonSuccess>
        </div>
      </div>

      <style jsx>{`
        .editor {
          display: flex;
          flex-direction: column;
        }

        .canvas {
          overflow: hidden;
          cursor: url(${circleSVG}) ${cursorOffset} ${cursorOffset}, auto;
        }

        .canvas-controls {
          display: grid;
          padding: 16px;
          background: hsl(0deg 0% 97%);
          border-top: 2px solid hsl(0deg 0% 80%);
          grid-template-columns: 1fr 1fr 1fr;
          place-items: center;
        }

        .canvas-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          justify-content: stretch;
          width: 100%;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default Editor;
