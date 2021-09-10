import React from "react";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

export const ZoomControls = ({
  zoomIn,
  zoomOut,
  resetTransform,
  centerView,
}: ReactZoomPanPinchRef) => (
  <div className="controlPanel">
    <button className="controlBtn" onClick={() => zoomIn()}>
      Zoom In +
    </button>
    <button className="controlBtn" onClick={() => zoomOut()}>
      Zoom Out -
    </button>
    <button className="controlBtn" onClick={() => resetTransform()}>
      Reset
    </button>
    <button className="controlBtn" onClick={() => centerView()}>
      Center
    </button>
    <style jsx>{`
      .controlPanel {
        position: absolute;
        z-index: 2;
        transform: translate(10px, 10px);
        max-width: calc(100% - 20px);
      }
      .controlBtn {
        padding: 6px 12px;
        background: white;
        border: 1px solid grey;
        border-radius: 5px;
        margin-right: 10px;
        font-size: 12px;
        text-transform: uppercase;
        font-weight: 600;
        cursor: pointer;
      }

      .controlBtn:focus {
        filter: brightness(90%);
      }

      .controlBtn:hover {
        filter: brightness(120%);
      }

      .controlBtn:active {
        opacity: 0.9;
      }
    `}</style>
  </div>
);
