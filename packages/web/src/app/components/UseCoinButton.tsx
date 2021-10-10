import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import CoinDropModal from '@app/components/modals/CoinDropModal';

const listen = (
  target: EventTarget,
  ...args: Parameters<typeof target.addEventListener>
) => {
  target.addEventListener(...args);
  return () => target.removeEventListener(...args);
};

const UseCoinButton = () => {
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const openCoinModal = () => setIsCoinModalOpen(true);
  const closeCoinModal = () => setIsCoinModalOpen(false);

  // Allow dragging files into window/document to open modal so you don't need to click the coin button first. This is somewhat brittle in that the conditionals and `useEffect` dependencies need to ~stay where they're at for this to work properly. This also doesn't check for the right drop (i.e. a single PNG image file) but I thought it felt better to show the drop modal and later error that the wrong files were dropped rather than giving no feedback to the user.
  const [hasDrop, setHasDrop] = useState(false);
  useEffect(() => {
    const removeDragEnter = listen(document, 'dragenter', (event) => {
      // Do nothing if document is not focused (i.e. tabbed out)
      if (!document.hasFocus()) return;
      setHasDrop(true);
    });
    const removeDragLeave = listen(document, 'dragleave', (event) => {
      if (hasDrop) {
        setHasDrop(false);
      }
    });
    const removeVisibilityChange = listen(document, 'visibilitychange', () => {
      if (document.hidden) {
        setHasDrop(false);
      }
    });
    const removeBlur = listen(window, 'blur', () => {
      setHasDrop(false);
    });

    return () => {
      removeDragEnter();
      removeDragLeave();
      removeVisibilityChange();
      removeBlur();
    };
  }, []);

  return (
    <div className="use-coin-button">
      <button className="invite-button" onClick={openCoinModal}>
        have a coin?
      </button>
      <Modal
        isOpen={isCoinModalOpen || hasDrop}
        onRequestClose={closeCoinModal}
        style={modalStyles}
      >
        <CoinDropModal />
      </Modal>
      <style jsx>{`
        .use-coin-button {
        }
        button.invite-button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #ffe131;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }
        button.invite-button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
};

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(51, 51, 51, 0.95)',
    backgroundImage: 'url(/graphics/coinbox-background.png)',
    backgroundPosition: 'center center',
    backgroundSize: '75%',
    backgroundRepeat: 'no-repeat',
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
export default UseCoinButton;
