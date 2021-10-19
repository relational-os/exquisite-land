import React from 'react';
import Editor from '@app/components/editor/Editor';

const Draw = () => {
  return (
    <div className="draw">
      <Editor
        x={-100}
        y={-100}
        hideControls
        hideMinimap
        closeModal={() => null}
      />
      <style jsx>{`
        .draw {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Draw;
