import React from "react";
import CanvasDraw from "react-canvas-draw";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Arweave from "./arweave";
import { ZoomControls } from "./utils/zoomControls";

const width = Array(4);
const height = Array(3);

for (var i = 0; i < width.length; i++) width[i] = i;
for (var i = 0; i < height.length; i++) height[i] = i;

const Surface = () => {
  return (
    <TransformWrapper>
      <TransformComponent>
        <div className="surface">
          {width.map((i) => {
            return height.map((j) => {
              // this is a test of an svg (note it does not render nicely inside the component)
              return <Arweave width={200} height={200} key={j}></Arweave>;
            });
          })}
        </div>
      </TransformComponent>
      <style jsx>{`
        .surface {
          display: grid;
          grid-template-rows: repeat(3, 1fr);
          grid-template-columns: repeat(4, 1fr);
        }
      `}</style>
    </TransformWrapper>
  );
};

export default Surface;
