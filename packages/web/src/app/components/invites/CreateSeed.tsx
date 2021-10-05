import {
  createSeed,
  getSignatureForTypedData,
  submitTx
} from '@app/features/Forwarder';
import getJsonRpcProvider from '@app/features/getJsonRpcProvider';
import { generateTokenID } from '@app/features/TileUtils';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState } from 'react';

const CreateSeed = () => {
  const [x, setX] = useState<string>('');
  const [y, setY] = useState<string>('');
  const [hash, setHash] = useState<string>();
  const [txDone, setTxDone] = useState(false);
  const { provider, account } = useWallet();
  const onSubmit = async () => {
    if (!provider || !account) return;
    const dataToSign = await createSeed(
      parseInt(x),
      parseInt(y),
      account,
      getJsonRpcProvider()
    );
    const signature = await getSignatureForTypedData(provider, dataToSign);
    const tx = await submitTx(dataToSign, signature);
    console.log(tx.hash);
    setHash(tx.hash);
    const receipt = await tx.wait(2);
    console.log(receipt);
    setTxDone(true);
  };
  return (
    <div className="create-seed">
      <label>Create Seed</label>
      <input
        type="number"
        placeholder="x"
        value={x}
        onChange={e => setX(e.target.value)}
      />
      <input
        type="number"
        placeholder="y"
        value={y}
        onChange={e => setY(e.target.value)}
      />
      <button onClick={onSubmit}>Submit</button>

      {txDone && (
        <>
          <img
            src={`/api/land-granter/generate?tokenId=${generateTokenID(
              parseInt(x),
              parseInt(y)
            )}`}
            width="200"
            height="200"
          />
          <div className="hash">Tx Hash: {hash}</div>
        </>
      )}
      <style jsx>{`
        .create-seed {
          background-color: lightcoral;
          padding: 10px 20px;
        }
        label {
          display: block;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default CreateSeed;
