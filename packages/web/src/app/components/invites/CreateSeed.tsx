import getContract from '@app/features/getContract';
import { generateTokenID } from '@app/features/TileUtils';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState } from 'react';

const CreateSeed = () => {
  const [x, setX] = useState<string>('');
  const [y, setY] = useState<string>('');
  const [hash, setHash] = useState<string>();

  const { provider } = useWallet();

  const onSubmit = async () => {
    if (!provider) return;
    const contract = getContract(provider.getSigner());
    const tx = await contract.createSeed(parseInt(x), parseInt(y));
    await tx.wait(1);
    console.log(tx.hash);
    setHash(tx.hash);
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

      {hash && (
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
