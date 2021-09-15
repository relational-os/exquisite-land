import React, { CSSProperties, useEffect, useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import Tile from "./Tile";
import Editor from "./Editor";
import useStore from "../features/State";
import { useFetchCanvas } from "@app/features/Graph";
import AutoSizer from "react-virtualized-auto-sizer";
import Modal from "react-modal";
Modal.setAppElement("#__next");

const Canvas = () => {
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();
  const [size, setSize] = useState(200);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeCanvasID = useStore((state) => state.activeCanvas);
  useFetchCanvas(activeCanvasID);

  useEffect(() => {
    setIsModalOpen(false);
  }, [activeCanvasID]);

  function closeModal() {
    setIsModalOpen(false);
    setX(undefined);
    setY(undefined);
  }

  function handleTileClick(x: number, y: number) {
    console.log(`tile ${x}, ${y} clicked!`);
    setX(x);
    setY(y);
    setIsModalOpen(true);
  }

  const zoomIn = () => setSize((s) => s * 1.25);
  const zoomOut = () => setSize((s) => Math.max(0, s / 1.25));

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Tile Editor Modal"
        closeTimeoutMS={200}
      >
        {x != undefined && y != undefined && (
          <Editor x={x} y={y} closeModal={closeModal}></Editor>
        )}
      </Modal>
      <div className="surface">
        <AutoSizer>
          {({ height, width }: { width: number; height: number }) => (
            <Grid
              width={width}
              height={height}
              columnCount={100}
              rowCount={100}
              columnWidth={size}
              rowHeight={size}
            >
              {({
                columnIndex,
                rowIndex,
                style,
              }: {
                columnIndex: number;
                rowIndex: number;
                style: CSSProperties;
              }) => (
                <Tile
                  x={columnIndex}
                  y={rowIndex}
                  handleTileClick={() => handleTileClick(columnIndex, rowIndex)}
                  style={style}
                />
              )}
            </Grid>
          )}
        </AutoSizer>
      </div>
      <div className="controls">
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
      <style jsx>{`
        .surface {
          width: 100vw;
          height: 100vh;
        }
        .controls {
          position: fixed;
          bottom: 0;
          right: 0;
          padding: 20px;
        }
      `}</style>
      <style jsx global>{`
        .ReactModal__Overlay {
          opacity: 0;
          transition: opacity 200ms ease-in-out;
        }

        .ReactModal__Overlay--after-open {
          opacity: 1;
        }

        .ReactModal__Overlay--before-close {
          opacity: 0;
        }
      `}</style>
    </>
  );
};

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "transparent",
    border: 0,
    padding: 0,
  },
};

export default Canvas;
