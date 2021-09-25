import { getCoordinates } from '@app/features/TileUtils';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../Button';

const CoinDropModal = ({ onClaim }: { onClaim?: () => void }) => {
  const { account } = useWallet();
  const [tokenId, setTokenId] = useState<number>();
  const [error, setError] = useState<string>();
  const [coinB64, setCoinB64] = useState<string>();
  const [claimed, setClaimed] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const coinB64 = (reader.result as string).replace(/^data:.+;base64,/, '');
      setCoinB64(coinB64);
      const { tokenId, error } = await fetch('/api/land-granter/check-coin', {
        method: 'POST',
        body: JSON.stringify({ coinB64 }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((r) => r.json());
      if (tokenId) setTokenId(tokenId);

      if (error) setError(error);
    };
    reader.readAsDataURL(file);
  };

  const claimCoin = async () => {
    if (!coinB64) return;
    if (!account) return alert('Not signed in!');
    const { tx, error } = await fetch('/api/land-granter/claim-coin', {
      method: 'POST',
      body: JSON.stringify({ coinB64, recipient: account }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((r) => r.json());
    if (tx && !error) {
      setClaimed(true);
      if (onClaim) setTimeout(onClaim, 1000);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/png',
    multiple: false
  });

  const reset = () => {
    setTokenId(undefined);
    setCoinB64(undefined);
    setError(undefined);
  };

  return (
    <div className="coindrop">
      {tokenId == undefined && error == undefined ? (
        <>
          <div className="message" {...getRootProps()}>
            <img className="empty" src="/graphics/coinbox-empty.png" />
            <input {...getInputProps()} />
            <div className="text">Drop your coin here!</div>
          </div>
          <div className="arrows">
            <img className="arrow-l" src="/graphics/coinbox-arrow.png" />
            <img className="arrow-r" src="/graphics/coinbox-arrow.png" />
          </div>
        </>
      ) : claimed ? (
        <div className="claimed">Success!</div>
      ) : tokenId != undefined ? (
        <div className="valid-token">
          <div className="message">
            <div className="coords">
              [{getCoordinates(tokenId)[0]},{getCoordinates(tokenId)[1]}]
            </div>
            <img src="/graphics/coinbox-valid.png" />
            <div className="text">Your coin is valid!</div>
          </div>
          <Button onClick={claimCoin}>Redeem</Button>
        </div>
      ) : (
        <div className="error">
          <div className="message">
            <div className="coords">Error!</div>
            <img src="/graphics/coinbox-invalid.png" />
            <div className="text"> {error}</div>
          </div>
          <Button onClick={reset}>Try Again</Button>
        </div>
      )}
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
          margin-bottom: 0.5rem;
          margin-left: 5px;
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

        .message .text {
          font-size: 24px;
          color: #5d86b0;
        }

        .message .coords {
          margin-bottom: 0.5rem;
          font-size: 42px;
          color: #5d86b0;
        }

        .claimed,
        .valid-token,
        .error {
          display: flex;
          flex-direction: column;
          justify-content: stretch;
          gap: 10px;
        }

        @keyframes point-l {
          0% {
            transform: translateX(0);
          }
          70% {
            transform: translateX(-20px);
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
            transform: translateX(20px) scaleX(-1);
          }
          100% {
            transform: translateX(0) scaleX(-1);
          }
        }
      `}</style>
    </div>
  );
};

export default CoinDropModal;
