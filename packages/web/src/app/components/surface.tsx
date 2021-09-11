import React, { useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Tile from "./Tile";
import Modal from "react-modal";
import Editor from "./Editor";

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
  },
};

Modal.setAppElement("#__next");

const Surface = () => {
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();
  const [modalIsOpen, setIsOpen] = useState(false);

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
          <>
            <span>hello! I am modal</span>
            <Editor x={x} y={y} closeModal={closeModal}></Editor>
          </>
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

export default Surface;
