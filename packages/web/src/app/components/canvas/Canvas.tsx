import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import CanvasTile from './CanvasTile';
import Editor from '../editor/Editor';
import { useFetchCanvas } from '@app/features/Graph';
import Modal from 'react-modal';
import { useWallet } from '@gimmixorg/use-wallet';
import InviteNeighborModal from '../modals/InviteNeighborModal';
import useOpenNeighborsForWallet from '@app/features/useOpenNeighborsForWallet';
import { useDebouncedCallback } from 'use-debounce';

Modal.setAppElement('#__next');

// TODO: decide if we want to make this dynamic based on tiles painted?
const DEFAULT_X = 7;
const DEFAULT_Y = 7;
const DEFAULT_Z = 2;

const columns = Array.from(Array(16).keys());
const rows = Array.from(Array(16).keys());

const Canvas = () => {
  const router = useRouter();
  const zoom =
    typeof router.query.z === 'string'
      ? Math.max(1, Math.min(8, +router.query.z))
      : DEFAULT_Z;
  const tileSize = zoom * 64;

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
          x: router.query.x ?? DEFAULT_X,
          y: router.query.y ?? DEFAULT_Y,
          z: router.query.z ?? DEFAULT_Z
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

  const zoomIn = () =>
    router.replace({ query: { ...router.query, z: zoom + 1 } });
  const zoomOut = () =>
    router.replace({ query: { ...router.query, z: zoom - 1 } });

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to tile specified by URL query params
  useEffect(() => {
    if (!containerRef.current) return;

    const containerSize = containerRef.current.getBoundingClientRect();

    const left =
      typeof router.query.x === 'string'
        ? +router.query.x * tileSize - containerSize.width / 2 + tileSize / 2
        : undefined;

    const top =
      typeof router.query.y === 'string'
        ? +router.query.y * tileSize - containerSize.height / 2 + tileSize / 2
        : undefined;

    if (left != null || top != null) {
      containerRef.current.scrollTo({ left, top });
    }
  }, [containerRef.current, tileSize]);

  const onScroll = useDebouncedCallback(
    ({ scrollLeft, scrollTop }: { scrollLeft: number; scrollTop: number }) => {
      if (!containerRef.current) return;
      const containerSize = containerRef.current.getBoundingClientRect();

      // Update URL based on scroll position and currently-centered tile
      const x = Math.floor(
        (scrollLeft + containerSize.width / 2) / tileSize
      ).toString();
      const y = Math.floor(
        (scrollTop + containerSize.height / 2) / tileSize
      ).toString();

      router.replace({ query: { ...router.query, x, y } });
    },
    200
  );

  return (
    <>
      <div
        ref={containerRef}
        className="surface"
        onScroll={(event) => {
          const { scrollTop, scrollLeft } = event.currentTarget;
          onScroll({ scrollTop, scrollLeft });
        }}
      >
        <div
          style={{
            position: 'relative',
            width: `${tileSize * columns.length}px`,
            height: `${tileSize * rows.length}px`
          }}
        >
          {columns.map((x) =>
            rows.map((y) => (
              <CanvasTile
                key={`${x},${y}`}
                x={x}
                y={y}
                openEditor={() => openEditor(x, y)}
                openGenerateInvite={() => openGenerateInvite(x, y)}
                style={{
                  width: `${tileSize}px`,
                  height: `${tileSize}px`,
                  position: 'absolute',
                  top: `${y * tileSize}px`,
                  left: `${x * tileSize}px`
                }}
              />
            ))
          )}
        </div>
      </div>
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
          width: 100vw;
          height: 100vh;
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
