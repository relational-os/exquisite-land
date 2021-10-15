import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import CanvasTile from './CanvasTile';
import Editor from '../editor/Editor';
import { useFetchCanvas } from '@app/features/Graph';
import Modal from 'react-modal';
import { useWallet } from '@gimmixorg/use-wallet';
import InviteNeighborModal from '../modals/InviteNeighborModal';
import useOpenNeighborsForWallet from '@app/features/useOpenNeighborsForWallet';
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper
} from 'react-zoom-pan-pinch';

Modal.setAppElement('#__next');

const columns = Array.from(Array(16).keys());
const rows = Array.from(Array(16).keys());

const Canvas = () => {
  const router = useRouter();
  const tileSize = 2 * 64; // TODO: zoom

  // Populate any missing query params to center the map on the default x, y, z
  useEffect(() => {
    if (
      router.isReady &&
      (router.query.x == null ||
        router.query.y == null ||
        router.query.z == null)
    ) {
      router.replace({
        query: {
          ...router.query,
          x: router.query.x,
          y: router.query.y,
          z: router.query.z
        }
      });
    }
  }, [router.isReady, router.query.x, router.query.y, router.query.z]);

  const [selectedX, setSelectedX] = useState<number>();
  const [selectedY, setSelectedY] = useState<number>();
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isInviteNeighborModalOpen, setIsInviteNeighborModalOpen] =
    useState(false);
  useFetchCanvas();
  useOpenNeighborsForWallet();

  const wrapperRef = useRef<ReactZoomPanPinchRef>(null);

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

  const zoomIn = () => wrapperRef.current?.zoomIn();
  const zoomOut = () => wrapperRef.current?.zoomOut();

  useEffect(() => {
    if (
      router.query.x != null ||
      router.query.y != null ||
      router.query.z != null
    ) {
      // set the params in the header
      console.log(parseInt(router.query.x as string));
      console.log(parseInt(router.query.y as string));
      // wrapperRef.current?.setTransform(
      //   parseInt(router.query.x as string),
      //   parseInt(router.query.y as string),
      //   1
      // );
    } else {
      wrapperRef.current?.centerView();
    }
  }, [wrapperRef, router.query]);

  return (
    <>
      <TransformWrapper
        ref={wrapperRef}
        centerOnInit
        centerZoomedOut
        minScale={0.25}
        maxScale={2}
        velocityAnimation={{ animationTime: 1000, sensitivity: 1000 }}
        onPanningStop={(_, event) => {
          console.log(event);
          // router.replace({ query: { ...router.query, x: getClientX(event), y: getClientX } });
        }}
      >
        <TransformComponent
          wrapperStyle={{
            maxWidth: '100%',
            maxHeight: '100vh'
          }}
        >
          <div className="surface">
            {rows.map((y) =>
              columns.map((x) => (
                <CanvasTile
                  key={`${x},${y}`}
                  x={x}
                  y={y}
                  openEditor={() => openEditor(x, y)}
                  openGenerateInvite={() => openGenerateInvite(x, y)}
                />
              ))
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
      {/* </div> */}
      <div className="controls">
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
      </div>
      <Modal
        isOpen={isEditorModalOpen}
        onRequestClose={closeEditorModal}
        style={editModalStyles}
        contentLabel="Tile Editor Modal"
      >
        {selectedX != null && selectedY != null && (
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
        {selectedX != null && selectedY != null && (
          <InviteNeighborModal x={selectedX} y={selectedY} />
        )}
      </Modal>
      <style jsx>{`
        .surface {
          margin: 10rem;
          padding: 1rem;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(${columns.length}, ${tileSize}px);
          grid-template-rows: repeat(${rows.length}, ${tileSize}px);
          box-shadow: 0 10px 64px 2px rgba(0, 0, 0, 0.3);
          background: #333;
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
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
    zIndex: 1112
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

const editModalStyles = {
  overlay: {
    backgroundColor: 'rgba(51, 51, 51, 0.95)',
    zIndex: 1112
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
