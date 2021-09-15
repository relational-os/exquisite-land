import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const CoinDrop = () => {
  const { account } = useWallet();
  const [tokenId, setTokenId] = useState<number>();
  const [error, setError] = useState<string>();
  const [coinB64, setCoinB64] = useState<string>();
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
    if (!account) return;
    const { tx, error } = await fetch('/api/land-granter/claim-coin', {
      method: 'POST',
      body: JSON.stringify({ coinB64, recipient: account }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json());
    console.log({ tx, error });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/png',
    multiple: false
  });

  return (
    <div className="coindrop">
      {tokenId == undefined && error == undefined ? (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drop a coin here, or click to find and upload</p>
        </div>
      ) : tokenId != undefined ? (
        <>
          Token is valid: {tokenId}
          <button onClick={claimCoin}>Claim</button>
        </>
      ) : (
        <>Error: {error}</>
      )}
      <style jsx>{`
        .coindrop {
          padding: 10px 20px;
          background-color: lightblue;
        }
      `}</style>
    </div>
  );
};

export default CoinDrop;
