import getContract from '@app/features/getContract';
import { generateTokenID } from '@app/features/TileUtils';
import useOpenNeighborsForWallet from '@app/features/useOpenNeighborsForWallet';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState } from 'react';
import Button from '../Button';

const InviteNeighborModal = ({ x, y }: { x: number; y: number }) => {
  const openNeighbors = useOpenNeighborsForWallet();
  const { provider } = useWallet();
  const [isGeneratingCoin, setGeneratingCoin] = useState(false);
  const [isCoinGenerated, setCoinGenerated] = useState(false);

  const inviteNeighbor = async () => {
    if (!provider) return;
    if (isGeneratingCoin) return;
    setGeneratingCoin(true);
    const contract = getContract(provider.getSigner());
    console.log(openNeighbors, x, y);
    const tokenId = openNeighbors.find(
      tile =>
        (tile.x == x && tile.y == y) ||
        (tile.x == x - 1 && tile.y == y) ||
        (tile.x == x + 1 && tile.y == y) ||
        (tile.x == x && tile.y == y - 1) ||
        (tile.x == x && tile.y == y + 1)
    )!.ownTokenId;
    const tx = await contract.inviteNeighbor(
      tokenId,
      x,
      y,
      process.env.NEXT_PUBLIC_LAND_GRANTER_CONTRACT_ADDRESS as string
    );
    await tx.wait(1);
    setCoinGenerated(true);
    console.log(tx.hash);
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
        <Button onClick={inviteNeighbor}>Generate Coin</Button>
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
