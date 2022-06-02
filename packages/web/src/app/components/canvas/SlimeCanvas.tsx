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
// import TileModal from '../modals/TileModal';
import SlimeTileModal from '../modals/SlimeTileModal';
import { useUpdate } from 'react-use';

Modal.setAppElement('#__next');

const columns = Array.from(Array(16).keys());
const rows = Array.from(Array(16).keys());

const SlimeCanvas = () => {
  const update = useUpdate();
  const router = useRouter();
  const tileSize = 2 * 64; // TODO: zoom

  const [selectedX, setSelectedX] = useState<number>();
  const [selectedY, setSelectedY] = useState<number>();
  const [isTilePreviewModalOpen, setIsTilePreviewModalOpen] = useState(false);
  useFetchCanvas();
  useOpenNeighborsForWallet();

  const wrapperRef = useRef<ReactZoomPanPinchRef>(null);

  const { provider } = useWallet();

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

  // todo: if we want percentages, fetch all data from TheGraph and do the math here.
  // todo: sort this data by poolTotal, truncate to top 8 or 10
  const mockData = [
    {
      tokenId: 1,
      x: 7,
      y: 7,
      poolTotal: 29523
    },
    {
      tokenId: 2,
      x: 1,
      y: 4,
      poolTotal: 145
    }
  ]

  const [isPanning, setPanning] = useState(false);
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
          <div className='canvas-header'>
            <div className="jaunt">Land 01: TERRA MASU</div>
            {/* <div className="jaunt">slime: 350/2000</div> */}
          </div>
          <div className="canvas-body">
            <div className="left"></div>
            <div className="surface">
              {rows.map((y) =>
                columns.map((x) => (
                  <CanvasTile
                    key={`${x},${y}`}
                    x={x}
                    y={y}
                    // openEditor={() => !isPanning}
                    // openGenerateInvite={() =>
                    //   !isPanning && openGenerateInvite(x, y)
                    // }
                    openTileModal={() => !isPanning && openTileModal(x, y)}
                  />
                ))
              )}
            </div>
            <div className="right"></div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      // todo: move to a modal                
      <div className="slime">
          <span>SLIME POOLS</span>

          <span>6 days remaining!</span>

          <div>
              <span>Leaderboard</span>
              <table>
                {
                  mockData.map((data, index) => (<>
                    <tr>
                      <td>
                        {index + 1}. 
                      </td>
                      <td>
                        [{data.x}, {data.y}]
                      </td>
                      <td>
                      §{data.poolTotal}
                      </td>
                    </tr>
                  </>))
                }
              </table>
          </div>
      </div>

      <style jsx>
          {`
            .slime {
              padding-top: 60px;
              position: fixed;
              top: 0;
              right: 0;
              height: 100%;
              width: 20%;
              background-color: #7CC45D;
            }

            .
          `}
      </style>

      <div className="controls">
        <button className="hide-controls-button">hide</button>
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
      </div>

      <Modal
        isOpen={isTilePreviewModalOpen}
        onRequestClose={closeTilePreviewModal}
        style={modalStyles}
        contentLabel="Tile Preview Modal"
      >
        {selectedX != undefined && selectedY != undefined && (
          <SlimeTileModal x={selectedX} y={selectedY} />
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

export default SlimeCanvas;
