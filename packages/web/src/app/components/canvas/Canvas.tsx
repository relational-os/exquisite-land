import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import CanvasTile from './CanvasTile';
import Editor from '../editor/Editor';
import { useFetchCanvas } from '@app/features/Graph';
import Modal from 'react-modal';
import { useWallet } from '@gimmixorg/use-wallet';
import InviteNeighborModal from '../modals/InviteNeighborModal';
import TransactionHistoryModal from '../modals/TransactionHistoryModal';
import useOpenNeighborsForWallet from '@app/features/useOpenNeighborsForWallet';
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper
} from 'react-zoom-pan-pinch';
import TileModal from '../modals/TileModal';

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

  return (
    <>
      <TransformWrapper
        ref={wrapperRef}
        centerOnInit
        minScale={0.25}
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
        onPanningStop={(_, event) => {
          console.log(event);
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
          <div className="canvas-header">
            ████████╗███████╗██████╗░██████╗░░█████╗░  ███╗░░░███╗░█████╗░░██████╗██╗░░░██╗
            ╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔══██╗  ████╗░████║██╔══██╗██╔════╝██║░░░██║
            ░░░██║░░░█████╗░░██████╔╝██████╔╝███████║  ██╔████╔██║███████║╚█████╗░██║░░░██║
            ░░░██║░░░██╔══╝░░██╔══██╗██╔══██╗██╔══██║  ██║╚██╔╝██║██╔══██║░╚═══██╗██║░░░██║
            ░░░██║░░░███████╗██║░░██║██║░░██║██║░░██║  ██║░╚═╝░██║██║░░██║██████╔╝╚██████╔╝
            ░░░╚═╝░░░╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝  ╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═════╝░░╚═════╝░
          </div>
          <div className="canvas-body">
            <div className="left">
              <div>
                <a href="">About</a>
              </div>
              <div>
                <a href="">FAQ</a>
              </div>
              <div>
                <a href="">Discord</a>
              </div>
              <div>
                <a href="">Tweeter</a>
              </div>
            </div>
            <div className="surface">
              {rows.map((y) =>
                columns.map((x) => (
                  <CanvasTile
                    key={`${x},${y}`}
                    x={x}
                    y={y}
                    openEditor={() => openEditor(x, y)}
                    openGenerateInvite={() => openGenerateInvite(x, y)}
                    openTileModal={() => openTileModal(x, y)}
                  />
                ))
              )}
            </div>
            <div className="right">
              <div className="activity">
                <div className="activity-title">Your Activity</div>
                <div className="activity-body">
                  <TransactionHistoryModal />
                </div>
              </div>

              <div className="discord">
                <div className="discord-title">Discord</div>
                <div className="discord-body">
                  <div className="junk">hey hey heyhey discord time!</div>
                </div>

                <a
                  className="discord-button"
                  href="https://discord.gg/pma4YtD6xW"
                >
                  enter the Exquisite Land Discord
                </a>
              </div>
            </div>
          </div>

          <div className="canvas-footer">
            <a href="https://relational.fyi" target="_blank">
              A Relational Game
            </a>
          </div>
        </TransformComponent>
      </TransformWrapper>

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
        .canvas-header,
        .canvas-body,
        .canvas-footer {
          display: flex;
        }

        .canvas-header {
          color: #666;
          width: 800px;
          margin: 10rem auto 0;
        }

        .canvas-body {
          margin: 5rem 15rem 2rem 15rem;
          padding: 0 1rem;
          gap: 2rem;
          font-size: 3rem;
        }

        .left,
        .right {
          display: flex;
          min-width: 40rem;
          flex-direction: column;
        }

        .activity {
          display: flex;
          flex-direction: column;
          margin-bottom: 2rem;
          flex: 1 1 auto;
        }

        .activity .activity-title {
          padding-bottom: 1rem;
          color: #666;
        }

        .activity .activity-body {
          flex: 1 1 auto;
          border: 2px solid #000;
        }

        .discord {
          display: flex;
          flex-direction: column;
          flex: 2 1 auto;
        }

        .discord .discord-title {
          padding-bottom: 1rem;
          color: #666;
        }

        .discord .discord-body {
          flex: 1 1 auto;
          border: 2px solid #000;
        }

        .discord .discord-body .junk {
          height: 100rem;
          background: brown;
        }

        .discord a.discord-button {
          text-align: center;
          background: purple;
          color: #fff;
          padding: 1rem;
        }

        .surface {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(${columns.length}, ${tileSize}px);
          grid-template-rows: repeat(${rows.length}, ${tileSize}px);
          box-shadow: 0 10px 64px 2px rgba(0, 0, 0, 0.3);
          background: #333;
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
