import { useWallet } from '@gimmixorg/use-wallet';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const CoinTests = () => {
  const { account } = useWallet();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const coinB64 = (reader.result as string).replace(
          /^data:.+;base64,/,
          ''
        );
        const res = await fetch('/api/land-granter/check-coin', {
          method: 'POST',
          body: JSON.stringify({ coinB64, recipient: account }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(r => r.json());
        console.log(res);
      };
      reader.readAsDataURL(file);
    },
    [account]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/png',
    multiple: false
  });

  return (
    <div className="coin-tests">
      {account ? (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop a coin here, or click to find and upload</p>
        </div>
      ) : (
        'Connect Wallet to start demo'
      )}
      <style jsx>{`
        .coin-tests {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default CoinTests;
