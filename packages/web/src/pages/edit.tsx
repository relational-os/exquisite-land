import React from "react";
import CanvasDraw from "react-canvas-draw";

const EditPage = () => {
  return (
    <div className="edit">
      <CanvasDraw canvasHeight={600} canvasWidth={600} />

      <style jsx>{`
        .edit {
        }
      `}</style>
    </div>
  );
};

export default EditPage;
