import useEditor, { Pixels } from '@app/hooks/use-editor';
import React from 'react';
import CanvasTile from '../canvas/CanvasTile';

interface EditorPreviewProps {
  pixels: Pixels;
  columns: number[];
  rows: number[];
  x: number;
  y: number;
}

const tileStyle = {
  width: '96px',
  height: '96px'
};

const EditorPreview = ({ pixels, x, y, columns, rows }: EditorPreviewProps) => {
  const { palette } = useEditor();

  return (
    <div className="editorpreview">
      <div style={{ display: 'flex' }}>
        <CanvasTile x={x - 1} y={y - 1} style={tileStyle} />
        <CanvasTile x={x} y={y - 1} style={tileStyle} />
        <CanvasTile x={x + 1} y={y - 1} style={tileStyle} />
      </div>
      <div style={{ display: 'flex' }}>
        <CanvasTile x={x - 1} y={y} style={tileStyle} />
        <div className="preview">
          {columns.map((y) => {
            return rows.map((x) => {
              return (
                <div
                  key={`${x}_${y}_preview`}
                  className="box-preview"
                  style={{
                    backgroundColor: palette[pixels?.[x]?.[y]]
                  }}
                ></div>
              );
            });
          })}
        </div>
        <CanvasTile x={x + 1} y={y} style={tileStyle} />
      </div>
      <div style={{ display: 'flex' }}>
        <CanvasTile x={x - 1} y={y + 1} style={tileStyle} />
        <CanvasTile x={x} y={y + 1} style={tileStyle} />
        <CanvasTile x={x + 1} y={y + 1} style={tileStyle} />
      </div>
      <style jsx>{`
        .editorpreview {
        }
        .preview {
          width: 96px;
          height: 96px;
          image-rendering: pixelated;
          display: grid;
          grid-template-columns: repeat(32, 1fr);
        }

        .tile {
          width: '96px';
          height: '96px';
        }

        .box-preview {
          width: 3px;
          height: 3px;
        }
      `}</style>
    </div>
  );
};

export default EditorPreview;
