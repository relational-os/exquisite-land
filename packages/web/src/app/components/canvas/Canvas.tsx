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
import TileModal from '../modals/SlimeTileModal';
import { useUpdate } from 'react-use';

Modal.setAppElement('#__next');

// Hardcoded value for mobile devides
const MOBILE_WIDTH_CUTOFF = 500;

const columns = Array.from(Array(16).keys());
const rows = Array.from(Array(16).keys());

const Canvas = () => {
  const update = useUpdate();
  const router = useRouter();
  const tileSize = 2 * 64; // TODO: zoom

  // Populate any missing query params to center the map on the default x, y, z
  // useEffect(() => {
  //   if (
  //     router.isReady &&
  //     (router.query.x == null ||
  //       router.query.y == null ||
  //       router.query.z == null)
  //   ) {
  //     router.replace({
  //       query: {
  //         ...router.query,
  //         x: router.query.x,
  //         y: router.query.y,
  //         z: router.query.z
  //       }
  //     });
  //   }
  // }, [router.isReady, router.query.x, router.query.y, router.query.z]);

  const [selectedX, setSelectedX] = useState<number>();
  const [selectedY, setSelectedY] = useState<number>();
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isInviteNeighborModalOpen, setIsInviteNeighborModalOpen] =
    useState(false);
  const [isTilePreviewModalOpen, setIsTilePreviewModalOpen] = useState(false);
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
  const openTileModal = (x: number, y: number) => {
    setSelectedX(x);
    setSelectedY(y);
    setIsTilePreviewModalOpen(true);
  };
  const closeTilePreviewModal = () => {
    setIsTilePreviewModalOpen(false);
    setSelectedX(undefined);
    setSelectedY(undefined);
  };

  // const [isDiscordFeedOpen, setDiscordFeedOpen] = useState(false);

  useEffect(() => {
    if (
      router.query.x != null ||
      router.query.y != null ||
      router.query.z != null
    ) {
      // set the params in the header
      // console.log(parseInt(router.query.x as string));
      // console.log(parseInt(router.query.y as string));
      // wrapperRef.current?.setTransform(
      //   parseInt(router.query.x as string),
      //   parseInt(router.query.y as string),
      //   1
      // );
    } else {
      wrapperRef.current?.centerView();
    }
  }, [wrapperRef, router.query]);

  const handleTileClick = (x: number, y: number) => {
    console.log(document.body.clientWidth)
    if (document.body.clientWidth <= MOBILE_WIDTH_CUTOFF) {
      openTileModal(x, y);
      return
    }

    if (!isPanning) {
      openTileModal(x, y)
    }
  }

  const [isPanning, setPanning] = useState(false);
  return (
    <>
      <TransformWrapper
        ref={wrapperRef}
        centerOnInit
        minScale={0.16}
        initialScale={0.9}
        centerZoomedOut
        maxScale={2}
        wheel={{ step: 0.07 }}
        velocityAnimation={{
          animationTime: 1000,
          animationType: 'easeInOutCubic',
          equalToMove: false
        }}
        alignmentAnimation={{
          animationType: 'easeInOutCubic'
        }}
        onPanningStart={() => {
          setTimeout(() => {
            setPanning(true);
          }, 150);
        }}
        onPanningStop={(_, event) => {
          setTimeout(() => {
            setPanning(false);
          }, 150);
          // router.replace({ query: { ...router.query, x: getClientX(event), y: getClientX } });
        }}
      >
        <TransformComponent
          wrapperStyle={{
            maxWidth: '100%',
            maxHeight: '100vh',
            cursor: 'grab'
          }}
        >
          <div className="canvas-header jaunt">Land 01: TERRA MASU</div>
          <div className="canvas-body">
            <div className="left"></div>
            <div className="surface-container">
              <div className="surface">
                {rows.map((y) =>
                  columns.map((x) => (
                    <CanvasTile
                      key={`${x},${y}`}
                      x={x}
                      y={y}
                      openEditor={() => !isPanning && openEditor(x, y)}
                      openGenerateInvite={() =>
                        !isPanning && openGenerateInvite(x, y)
                      }
                      openTileModal={() => handleTileClick(x, y)}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="right"></div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      <div className="controls">
        <button className="hide-controls-button">hide</button>
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
      </div>

      <div className="scrub-controls">
        <button className="play jaunt">&#x3e;</button>
        <div className="scrub-bar"></div>
        <div className="scrub-handle"></div>
        <div className="now">NOW</div>
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
            refreshCanvas={update}
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
      <Modal
        isOpen={isTilePreviewModalOpen}
        onRequestClose={closeTilePreviewModal}
        style={modalStyles}
        contentLabel="Tile Preview Modal"
      >
        {selectedX != undefined && selectedY != undefined && (
          <TileModal x={selectedX} y={selectedY} />
        )}
      </Modal>
      <style jsx>{`
        button.close {
          position: fixed;
          top: 1.2rem;
          right: 1rem;
          background: transparent;
          outline: none;
          border: none;
          font-size: 32px;
          color: #fff;
          cursor: pointer;
        }
        button.close:hover {
          box-shadow: none;
        }

        .canvas-header,
        .canvas-body {
          display: flex;
        }

        .canvas-header {
          color: #666;
          text-shadow: 0 -4px #000;
          width: 1000px;
          margin: 12rem auto 0;
          text-align: center;
          font-size: 104px;
        }

        .canvas-body {
          margin: 5rem 15rem 15rem 15rem;
          padding: 0 1rem;
          gap: 2rem;
          font-size: 3rem;
        }

        .left,
        .right {
          display: flex;
          min-width: 40rem;
          flex-direction: column;
          max-height: ${columns.length * tileSize}px;
        }

        .surface {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(${columns.length}, ${tileSize}px);
          grid-template-rows: repeat(${rows.length}, ${tileSize}px);
          box-shadow: 0 10px 64px 2px rgba(0, 0, 0, 0.3);
          background-image: url("/static/combined.png");
          image-rendering: pixelated;
          background-size: 100%;
          background-repeat: no-repeat;
        }

        .surface-container {
          background: #333;
          padding: 1rem;
        }

        .canvas-footer {
          color: #666;
          font-size: 2rem;
          padding: 2rem;
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
        .controls .hide-controls-button {
          display: none;
          position: fixed;
          left: 30px;
          bottom: 30px;
        }

        .scrub-controls {
           {
            /* display: flex; */
          }
          display: none;
          flex-direction: row;
          align-items: center;
          gap: 1rem;
          position: fixed;
          bottom: 0;
          right: 0;
          left: 0;
          width: 30vw;
          margin: 0 auto 30px;
        }
        .scrub-controls .scrub-bar {
          width: 100%;
          height: 4px;
          background: #444;
        }
        .scrub-controls .scrub-handle {
          position: absolute;
          top: 4px;
          left: 100px;
          width: 8px;
          height: 30px;
          background: #eee;
          cursor: move;
        }
        .scrub-controls .now {
          color: #fff;
          font-size: 1.1rem;
        }
        .scrub-controls button {
          display: block;
          padding: 8px 12px;
          border: 0;
          background: #eee;
          font-size: 18px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }
        .scrub-controls button:hover {
          box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
        }

        .close-button {
          position: fixed;
          top: 0.5rem;
          right: 0.5rem;
          color: #fff;
        }
      `}</style>
    </>
  );
};

const modalStyles = {
  overlay: {
    backgroundColor: '#282424f6',
    zIndex: 1112,
    backdropFilter: 'blur(4px)',
    cursor: 'pointer',
    backgroundImage: 'url(/graphics/icon-close.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '98% 2vh',
    backgroundSize: '20px'
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
    padding: 0,
    borderRadius: 0,
    cursor: 'default'
  }
};

const editModalStyles = {
  overlay: {
    backgroundColor: '#201e1ef6',
    zIndex: 1112,
    backdropFilter: 'blur(4px)',
    cursor: 'pointer'
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
    padding: 0,
    borderRadius: 0,
    cursor: 'default'
  }
};

export default Canvas;
