import { getCoordinates } from '@app/features/TileUtils';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useEffect, useState } from 'react';
import Button from '../Button';
import Modal from 'react-modal';
import ConnectWalletModal from './ConnectWalletModal';
import { useCoinDrop } from '@app/hooks/useCoinDrop';

const CoinDropModal = ({ onClaim }: { onClaim?: () => void }) => {
  const { account } = useWallet();
  const [claimed, setClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string>();
  const [processing, setProcessing] = useState(false);
  const [isConnectedModalOpen, setIsConnectedModalOpen] = useState(false);
  const [longWait, setLongWait] = useState(false);

  const {
    tokenId,
    coinCreator,
    dropError,
    reset,
    getRootProps,
    getInputProps
  } = useCoinDrop(setProcessing);

  const claimCoin = async () => {
    setLongWait(false);
    if (tokenId == undefined) return;
    if (!account) setIsConnectedModalOpen(true);

    setTimeout(() => {
      setLongWait(true);
    }, 5000);
    setProcessing(true);
    setClaimError(undefined);
    const { tx, error } = await fetch('/api/land-granter/claim-coin', {
      method: 'POST',
      // TODO: body should also accept any coin creator (or fetch from db)
      body: JSON.stringify({
        tokenId,
        recipient: account,
        coinCreator
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((r) => r.json());

    // TODO: only set processing as false once TheGraph has been updated?
    // this will prevent the player from getting into a state where they need to refresh the page
    // otherwise let them work with local state and assume the chain is good to go?
    // -> save button in the editor could be disabled until chain has confirmations?
    setProcessing(false);
    if (tx && !error) {
      setClaimed(true);

      if (onClaim) setTimeout(onClaim, 1000);
    } else if (error) {
      setClaimed(false);
      setClaimError(error);
    }

    // TODO: refresh the graph
  };

  useEffect(() => {
    if (account) setIsConnectedModalOpen(false);
  }, [account]);

  return (
    <div className="coindrop">
      {tokenId == null && dropError == null ? (
        <>
          <div className="message" {...getRootProps()}>
            <input {...getInputProps()} />
            {processing ? (
              <>
                <img
                  className="empty-withcoin"
                  src="/graphics/coinbox-empty-withcoin.png"
                />
                <div className="text">Processing coin...</div>
              </>
            ) : (
              <>
                <img className="empty" src="/graphics/coinbox-empty.png" />
                <div className="text">Drop your coin here!</div>

                <div className="arrows">
                  <img className="arrow-l" src="/graphics/coinbox-arrow.png" />
                  <img className="arrow-r" src="/graphics/coinbox-arrow.png" />
                </div>
              </>
            )}
          </div>
        </>
      ) : claimed ? (
        <div className="claimed">
          Success!
          <div className="info">
            Tile [{getCoordinates(tokenId!)[0]}, {getCoordinates(tokenId!)[1]}]
            is now yours! Click to continue...
          </div>
        </div>
      ) : !claimError && tokenId != undefined ? (
        <div className="valid-token">
          <div className="message">
            <div className="coords text">
              Tile [{getCoordinates(tokenId)[0]},{getCoordinates(tokenId)[1]}]
              is available!
            </div>
            <img src="/graphics/coinbox-valid.png" />
            {processing ? <div className="text">Redeeming coin...</div> : ''}
            {longWait && <div className="text wait">(this can take a bit)</div>}
          </div>
          {!processing && (
            <button className="redeem" onClick={claimCoin}>
              Redeem
            </button>
          )}
        </div>
      ) : (
        <div className="error">
          <div className="message">
            <div className="coords">Error!</div>
            <img src="/graphics/coinbox-invalid.png" />
            <div className="text">{dropError || claimError}</div>
          </div>
          <Button onClick={reset}>Try again</Button>
        </div>
      )}
      <Modal
        isOpen={isConnectedModalOpen}
        onRequestClose={() => setIsConnectedModalOpen(false)}
        contentLabel="Connect Wallet Modal"
        style={modalStyles}
      >
        <ConnectWalletModal />
      </Modal>
      <style jsx>{`
        .coindrop {
          width: 400px;
          text-align: center;
          overflow: hidden;
        }
        .message {
          cursor: pointer;
        }

        .message img {
          width: 300px;
          margin-bottom: 0.2rem;
          margin-left: 5px;
        }

        .arrows {
          pointer-events: none;
        }
        .arrows img.arrow-l {
          position: absolute;
          bottom: 4.6rem;
          left: 18px;
          max-width: 200px;
          max-height: 110px;
          width: auto;
          height: auto;
          animation: point-l 1s ease-in-out infinite;
        }
        .arrows img.arrow-r {
          position: absolute;
          bottom: 4.6rem;
          right: 18px;
          max-width: 200px;
          max-height: 110px;
          width: auto;
          height: auto;
          animation: point-r 1s ease-in-out infinite;
        }

        .message .coords {
          margin-bottom: 0.5rem;
          font-size: 42px;
          color: #5d86b0;
        }
        .message .text {
          font-size: 24px;
          color: #5d86b0;
        }
        .message .wait {
          margin-top: 0.25rem;
          opacity: 0.6;
        }

        .claimed,
        .valid-token,
        .error {
          display: flex;
          flex-direction: column;
          justify-content: stretch;
          gap: 10px;
          font-size: 32px;
          color: white;
        }

        button.redeem {
          display: block;
          width: 70%;
          margin: 0 auto;
          padding: 8px 14px;
          border: 0;
          background: #ffb800;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: #292524;
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }
        button.redeem:hover {
          box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
        }

        @keyframes point-l {
          0% {
            transform: translateX(0);
          }
          70% {
            transform: translateX(-18px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes point-r {
          0% {
            transform: translateX(0) scaleX(-1);
          }
          70% {
            transform: translateX(18px) scaleX(-1);
          }
          100% {
            transform: translateX(0) scaleX(-1);
          }
        }
      `}</style>
    </div>
  );
};

const modalStyles = {
  overlay: {
    backgroundColor: '#282424f6',
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

export default CoinDropModal;
