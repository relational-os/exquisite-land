import React, { CSSProperties, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import CanvasTile from './CanvasTile';
import Editor from '../editor/Editor';
import { useFetchCanvas } from '@app/features/Graph';
import AutoSizer from 'react-virtualized-auto-sizer';
import Modal from 'react-modal';
import { useWallet } from '@gimmixorg/use-wallet';
import InviteNeighborModal from '../modals/InviteNeighborModal';
Modal.setAppElement('#__next');

const Canvas = () => {
  const [tileSize, setTileSize] = useState(200);

  const [selectedX, setSelectedX] = useState<number>();
  const [selectedY, setSelectedY] = useState<number>();
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isInviteNeighborModalOpen, setIsInviteNeighborModalOpen] =
    useState(false);
  useFetchCanvas();

  const closeEditorModal = () => {
    setIsEditorModalOpen(false);
    setSelectedX(undefined);
    setSelectedY(undefined);
  };
  const closeInviteNeighborModal = () => {
    setIsInviteNeighborModalOpen(false);
  };

  const { provider } = useWallet();

  const openEditor = (x: number, y: number) => {
    if (!provider) return alert('Not signed in.');
    setSelectedX(x);
    setSelectedY(y);
    setIsEditorModalOpen(true);
  };

  const openGenerateInvite = (x: number, y: number) => {
    if (!provider) return alert('Not signed in.');
    setSelectedX(x);
    setSelectedY(y);
    setIsInviteNeighborModalOpen(true);
  };

  const zoomIn = () => setTileSize(s => s * 1.25);
  const zoomOut = () => setTileSize(s => Math.max(0, s / 1.25));

  return (
    <>
      <div className="surface">
        <AutoSizer>
          {({ height, width }: { width: number; height: number }) => (
            <Grid
              width={width}
              height={height}
              columnCount={32}
              rowCount={32}
              columnWidth={tileSize}
              rowHeight={tileSize}
            >
              {({
                columnIndex,
                rowIndex,
                style
              }: {
                columnIndex: number;
                rowIndex: number;
                style: CSSProperties;
              }) => (
                <CanvasTile
                  x={columnIndex}
                  y={rowIndex}
                  openEditor={() => openEditor(columnIndex, rowIndex)}
                  openGenerateInvite={() =>
                    openGenerateInvite(columnIndex, rowIndex)
                  }
                  style={style}
                />
              )}
            </Grid>
          )}
        </AutoSizer>
      </div>
      <div className="controls">
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
      </div>
      <Modal
        isOpen={isEditorModalOpen}
        onRequestClose={closeEditorModal}
        style={modalStyles}
        contentLabel="Tile Editor Modal"
      >
        {selectedX != undefined && selectedY != undefined && (
          <Editor
            x={selectedX}
            y={selectedY}
            closeModal={closeEditorModal}
          ></Editor>
        )}
      </Modal>
      <Modal
        isOpen={isInviteNeighborModalOpen}
        onRequestClose={closeInviteNeighborModal}
        style={modalStyles}
        contentLabel="Invite Neighbor Modal"
      >
        {selectedX != undefined && selectedY != undefined && (
          <InviteNeighborModal x={selectedX} y={selectedY} />
        )}
      </Modal>
      <style jsx>{`
        .surface {
          width: 100%;
          height: 100%;
          overflow: auto;
        }
        .controls {
          position: fixed;
          bottom: 0;
          right: 0;
          padding: 30px;
        }
        .controls button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #eee;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }

        .controls button:hover {
          box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: 0,
    padding: 0
  }
};

export default Canvas;
