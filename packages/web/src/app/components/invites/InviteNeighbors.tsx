import getContract from '@app/features/getContract';
import { generateTokenID } from '@app/features/TileUtils';
import useOpenNeighborsForWallet from '@app/features/useOpenNeighborsForWallet';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState } from 'react';

const InviteNeighbors = () => {
  const openNeighbors = useOpenNeighborsForWallet();
  const { provider } = useWallet();

  const [tokenId, setTokenId] = useState<number>();
  const [hash, setHash] = useState<string>();
  const inviteNeighbor = async (
    tokenId: number,
    canvasId: number,
    x: number,
    y: number
  ) => {
    if (!provider) return;
    const contract = getContract(provider.getSigner());
    setTokenId(generateTokenID(canvasId, x, y));
    const tx = await contract.inviteNeighbor(
      tokenId,
      x,
      y,
      process.env.NEXT_PUBLIC_LAND_GRANTER_CONTRACT_ADDRESS as string
    );
    await tx.wait(1);
    console.log(tx.hash);
    setHash(tx.hash);
  };
  return (
    <div className="inviteneighbors">
      {openNeighbors.map(neighbor => (
        <div className="open-neighbor" key={neighbor.tokenId}>
          {neighbor.canvasId}, {neighbor.x}, {neighbor.y}{' '}
          <button
            onClick={() =>
              inviteNeighbor(
                neighbor.ownTokenId,
                neighbor.canvasId,
                neighbor.x,
                neighbor.y
              )
            }
          >
            Invite
          </button>
        </div>
      ))}
      {hash && (
        <>
          Token id: {tokenId}{' '}
          <img
            src={`/api/land-granter/generate?tokenId=${tokenId}`}
            width="200"
            height="200"
          />
        </>
      )}
      <style jsx>{`
        .inviteneighbors {
          background-color: lightseagreen;
          padding: 10px 20px;
        }
      `}</style>
    </div>
  );
};

export default InviteNeighbors;