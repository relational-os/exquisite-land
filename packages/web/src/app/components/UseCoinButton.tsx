import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import CoinDropModal from '@app/components/modals/CoinDropModal';
import Head from 'next/head';
import { useWallet } from '@gimmixorg/use-wallet';
import WalletConnectProvider from '@walletconnect/web3-provider';

const listen = (
  target: EventTarget,
  ...args: Parameters<typeof target.addEventListener>
) => {
  target.addEventListener(...args);
  return () => target.removeEventListener(...args);
};

const UseCoinButton = () => {
  const { account, connect } = useWallet();
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);

  const openCoinModal = () => {
    if (!account)
      connect({
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY as string
            }
          }
        },
        theme: 'dark'
      });
    setIsCoinModalOpen(true);
  };
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
      <Head>
        {/* Preload coin images */}
        <link
          rel="preload"
          href="/graphics/coinbox-empty.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/graphics/coinbox-arrow.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/graphics/coinbox-background.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/graphics/coinbox-valid.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/graphics/coinbox-invalid.png"
          as="image"
          type="image/png"
        />
      </Head>

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
        button.invite-button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #ffb804;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
          cursor: pointer;
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
    backgroundColor: '#282424f6',
    backgroundImage: 'url(/graphics/coinbox-background.png)',
    backgroundPosition: '58%',
    backgroundSize: '75%',
    backgroundRepeat: 'no-repeat',
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
    padding: 0
  }
};
export default UseCoinButton;
