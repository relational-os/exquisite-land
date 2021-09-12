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

const Editor = ({ x, y, closeModal }: EditorProps) => {
  const { brush, brushColor, brushSize, setTile } = useEditor();
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

    if (!svg) return;

    const optimizedSvg = await fetch("/api/optimize", {
      method: "POST",
      body: svg,
    })
      .then((res) => res.json())
      .then((s) => s.data as string);

    const svgElement = new DOMParser().parseFromString(
      optimizedSvg,
      "text/xml"
    );
    const pathStrings: string[] = [];
    const pathElements = svgElement.getElementsByTagName("path");
    for (const pathElement of pathElements) {
      let pathString = pathElement.getAttribute("d");
      if (!pathString) continue;
      console.log(pathString.replace(/(\.\d{0,})/g, ""));
      pathStrings.push(pathString);
    }
    let paths = await canvasRef.current.exportPaths();
    setTile({ x, y, svg: optimizedSvg, paths });
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
