import React, { useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Tile from "./Tile";
import Modal from "react-modal";
import Editor from "./Editor";
import useStore from "../features/State";
import { useFetchCanvas } from "@app/features/Graph";

const width = Array(100);
const height = Array(100);

for (var x = 0; x < width.length; x++) width[x] = x;
for (var y = 0; y < height.length; y++) height[y] = y;

const customStyles = {
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

Modal.setAppElement("#__next");

const Canvas = () => {
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();
  const [modalIsOpen, setIsOpen] = useState(false);

  let activeCanvasID = useStore((state) => state.activeCanvas);
  useFetchCanvas(activeCanvasID);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
    setX(undefined);
    setY(undefined);
  }

  function handleTileClick(x: number, y: number) {
    console.log(`tile ${x}, ${y} clicked!`);
    setX(x);
    setY(y);
    setIsOpen(true);
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Tile Editor Modal"
      >
        {x != undefined && y != undefined && (
          <Editor x={x} y={y} closeModal={closeModal}></Editor>
        )}
      </Modal>

      <TransformWrapper>
        <TransformComponent>
          <div className="surface">
            {width.map((y) => {
              return height.map((x) => {
                // this is a test of an svg (note it does not render nicely inside the component)
                // return <Arweave width={200} height={200} key={j}></Arweave>;
                return (
                  <Tile
                    key={`tile-${x}-${y}`}
                    x={x}
                    y={y}
                    handleTileClick={() => handleTileClick(x, y)}
                  />
                );
              });
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>
      <style jsx>{`
        .surface {
          display: grid;
          grid-template-rows: repeat(100, 200px);
          grid-template-columns: repeat(100, 200px);
        }
      `}</style>
    </>
  );
};

export default Canvas;
