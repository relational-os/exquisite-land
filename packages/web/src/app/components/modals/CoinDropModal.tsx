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
      }).then(r => r.json());
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
    }).then(r => r.json());
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
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="message">
            Drop a coin here, or click to find and upload
          </div>
        </div>
      ) : claimed ? (
        <div className="claimed">Success!</div>
      ) : tokenId != undefined ? (
        <div className="valid-token">
          <div className="message">
            Token is valid! ({getCoordinates(tokenId)[0]},{' '}
            {getCoordinates(tokenId)[1]})
          </div>
          <Button onClick={claimCoin}>Claim</Button>
        </div>
      ) : (
        <div className="error">
          <div className="message">Error! {error}</div>
          <Button onClick={reset}>Try Again</Button>
        </div>
      )}
      <style jsx>{`
        .coindrop {
          border: 1px solid black;
          background-color: #f1f1f1;
          padding: 20px;
        }
        .message {
          cursor: pointer;
          font-size: 24px;
        }
        .claimed,
        .valid-token,
        .error {
          display: flex;
          flex-direction: column;
          justify-content: stretch;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default CoinDropModal;
