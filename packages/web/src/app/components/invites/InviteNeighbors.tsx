import { LAND_GRANTER_CONTRACT_ADDRESS } from '@app/features/AddressBook';
import getContract from '@app/features/getContract';
import { generateTokenID } from '@app/features/TileUtils';
import { useOpenNeighborStore } from '@app/features/useOpenNeighborsForWallet';
import useTransactionsStore from '@app/features/useTransactionsStore';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState } from 'react';

const InviteNeighbors = () => {
  const openNeighbors = useOpenNeighborStore((state) => state.openNeighbors);
  const { provider } = useWallet();

  const [tokenId, setTokenId] = useState<number>();
  const [hash, setHash] = useState<string>();
  const inviteNeighbor = async (tokenId: number, x: number, y: number) => {
    if (!provider) return;
    const contract = getContract(provider.getSigner());
    setTokenId(generateTokenID(x, y));
    const tx = await contract.inviteNeighbor(
      tokenId,
      x,
      y,
      LAND_GRANTER_CONTRACT_ADDRESS
    );
    useTransactionsStore.getState().addTransaction({
      title: `Inviting neighbor to ${x}, ${y}`,
      hash: tx.hash,
      status: 'pending',
      date: new Date(),
      type: 'invite-neighbor'
    });
    await tx.wait(1);
    console.log(tx.hash);
    setHash(tx.hash);
  };
  return (
    <div className="invite-neighbors">
      {openNeighbors.map((neighbor) => (
        <div className="open-neighbor" key={neighbor.tokenId}>
          {neighbor.x}, {neighbor.y}{' '}
          <button
            onClick={() =>
              inviteNeighbor(neighbor.ownTokenId, neighbor.x, neighbor.y)
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
        .invite-neighbors {
          background-color: lightseagreen;
          padding: 10px 20px;
        }
      `}</style>
    </div>
  );
};

export default InviteNeighbors;
