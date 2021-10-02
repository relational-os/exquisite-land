import {
  getSignatureForTypedData,
  inviteNeighbor,
  submitTx
} from '@app/features/Forwarder';
import getJsonRpcProvider from '@app/features/getJsonRpcProvider';
import { generateTokenID } from '@app/features/TileUtils';
import { useOpenNeighborStore } from '@app/features/useOpenNeighborsForWallet';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState } from 'react';
import Button from '../Button';

const InviteNeighborModal = ({ x, y }: { x: number; y: number }) => {
  const ownTokenId = useOpenNeighborStore(
    state =>
      state.openNeighbors.find(tile => tile.x == x && tile.y == y)!.ownTokenId
  );
  const { provider, account } = useWallet();
  const [isGeneratingCoin, setGeneratingCoin] = useState(false);
  const [isCoinGenerated, setCoinGenerated] = useState(false);

  const inviteNeighborClicked = async () => {
    if (!provider || !account) return;
    if (isGeneratingCoin) return;
    setGeneratingCoin(true);
    const dataToSign = await inviteNeighbor(
      ownTokenId,
      x,
      y,
      process.env.NEXT_PUBLIC_LAND_GRANTER_CONTRACT_ADDRESS as string,
      account,
      getJsonRpcProvider()
    );
    const signature = await getSignatureForTypedData(provider, dataToSign);
    const tx = await submitTx(dataToSign, signature);
    console.log(tx.hash);
    const receipt = await tx.wait(2);
    console.log(receipt);
    setCoinGenerated(true);
  };

  return (
    <div className="invite-neighbor-modal">
      <div className="message">
        Invite someone to [{x}, {y}]
      </div>
      {isCoinGenerated ? (
        <img
          src={`/api/land-granter/generate?tokenId=${generateTokenID(x, y)}`}
          width={100}
          height={100}
        />
      ) : isGeneratingCoin ? (
        <div className="message">Generating...</div>
      ) : (
        <Button onClick={inviteNeighborClicked}>Generate Coin</Button>
      )}
      <style jsx>{`
        .invite-neighbor-modal {
          background-color: white;
          border: 1px solid black;
          padding: 20px;
        }
        .message {
          font-size: 24px;
        }
      `}</style>
    </div>
  );
};

export default InviteNeighborModal;
