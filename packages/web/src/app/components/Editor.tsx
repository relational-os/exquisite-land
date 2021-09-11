import React, { useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import useStore from "../features/State";

const Editor = ({
  x,
  y,
  closeModal,
}: {
  x: number;
  y: number;
  closeModal: () => void;
}) => {
  async function handleSave() {
    console.log(`tile(${x}, ${y}) saved!`);

    if (!canvasRef.current) {
      return;
    }

    let svg = await canvasRef.current.exportSvg();
    console.log("saving svg to state", svg);
    useStore.setState((current) => {
      current.svgs[`${x}-${y}`] = svg;
      return current;
    });

    closeModal();
  }
  const canvasRef = useRef<ReactSketchCanvas>(null);
  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
  };
  return (
    <div className="editor">
      <ReactSketchCanvas
        ref={canvasRef}
        height="600px"
        width="600px"
        strokeWidth={4}
        strokeColor="red"
        style={styles}
      />
      <button onClick={handleSave}>Save</button>
      <style jsx>{`
        .editor {
        }
      `}</style>
    </div>
  );
};

export default Editor;
