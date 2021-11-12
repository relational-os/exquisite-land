import { LAND_GRANTER_CONTRACT_ADDRESS } from '@app/features/AddressBook';
import {
  getSignatureForTypedData,
  inviteNeighbor,
  submitTx
} from '@app/features/Forwarder';
import { getJsonRpcProvider } from '@app/features/getJsonRpcProvider';
import { generateTokenID } from '@app/features/TileUtils';
import {
  OpenNeighborStatus,
  useOpenNeighborStore
} from '@app/features/useOpenNeighborsForWallet';
import useTransactionsStore from '@app/features/useTransactionsStore';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useEffect, useState } from 'react';

const InviteNeighborModal = ({ x, y }: { x: number; y: number }) => {
  const ownTokenId = useOpenNeighborStore(
    (state) =>
      state.openNeighbors.find((tile) => tile.x == x && tile.y == y)!.ownTokenId
  );
  const tileToInvite = useOpenNeighborStore((state) =>
    state.openNeighbors.find((tile) => tile.x == x && tile.y == y)
  );
  const { provider, account } = useWallet();
  const [isGeneratingCoin, setGeneratingCoin] = useState(false);
  const [isCoinGenerated, setCoinGenerated] = useState(false);
  const [awaitingSigniture, setAwaitingSigniture] = useState(false);

  useEffect(() => {
    if (tileToInvite?.status == OpenNeighborStatus.COIN_GENERATED) {
      setCoinGenerated(true);

      // UNCOMMENT THIS TO SEE REGENERATION FLOW UI
      // setCoinGenerated(false);
    }
  }, [tileToInvite]);

  const inviteNeighborClicked = async () => {
    if (!provider || !account) return;
    if (isGeneratingCoin) return;

    // UNCOMMENT THIS TO SEE REGENERATION FLOW UI
    // if (tileToInvite?.status == OpenNeighborStatus.COIN_GENERATED) return;

    setAwaitingSigniture(true);
    const dataToSign = await inviteNeighbor(
      ownTokenId,
      x,
      y,
      LAND_GRANTER_CONTRACT_ADDRESS,
      account,
      getJsonRpcProvider
    );
    let signature = await getSignatureForTypedData(provider, dataToSign).catch(
      () => {}
    );
    setAwaitingSigniture(false);

    if (signature) {
      setGeneratingCoin(true);
      const tx = await submitTx(dataToSign, signature);
      useTransactionsStore.getState().addTransaction({
        title: `Inviting neighbor to ${x}, ${y}`,
        hash: tx.hash,
        status: 'pending',
        date: new Date(),
        type: 'invite-neighbor'
      });
      console.log(tx.hash);
      const receipt = await tx.wait(2);
      console.log(receipt);
      setCoinGenerated(true);
    }
  };

  return (
    <div className="invite-neighbor-modal">
      <div className="message">
        Invite a neighbor to [{x},{y}]
      </div>

      {isCoinGenerated ? (
        <>
          <img
            src={`/api/land-granter/generate?tokenId=${generateTokenID(
              x,
              y
            )}&address=${account}`}
            width={250}
            height={250}
            className="coin"
          />
          <div className="saveas">"right-click save as" or</div>
          <a
            href={`/api/land-granter/generate?tokenId=${generateTokenID(
              x,
              y
            )}&address=${account}`}
            download={`[${x}, ${y}].png`}
            className="download-button"
            target="_blank"
          >
            Download coin
          </a>
        </>
      ) : isGeneratingCoin || awaitingSigniture ? (
        <>
          <div className="coin-blank">
            <img src="/graphics/coin-spin.gif" className="coin-spin" />
          </div>
          <button disabled>
            {isGeneratingCoin ? 'generating...' : 'sign to continue...'}
          </button>
        </>
      ) : (
        <>
          <div className="coin-blank">
            <p>neighbor</p>
            <h3>
              [{x},{y}]
            </h3>
          </div>
          <button onClick={inviteNeighborClicked}>Generate coin</button>
        </>
      )}
      <style jsx>{`
        .invite-neighbor-modal {
          background-color: #c066ea;
          width: 400px;
          padding: 20px;
          text-align: center;
        }
        .coin-blank {
          width: 200px;
          height: 200px;
          margin: 20px auto;
          border-radius: 50%;
          border: 1px dashed #000;
          font-size: 42px;
        }

        .coin-blank p {
          margin-top: 3.2rem;
          margin-bottom: -3rem;
        }
        .coin-blank p,
        .coin-blank h3 {
          opacity: 0.4;
          font-weight: normal;
        }

        img.coin {
          margin: 0 auto;
        }

        img.coin-spin {
          width: 50%;
          height: auto;
          margin: 44px auto;
        }

        .saveas {
          font-size: 0.9rem;
          margin: 0.2rem 0 0.6rem;
          opacity: 0.5;
        }

        button,
        .download-button {
          display: block;
          margin: 0 auto;
          padding: 8px 14px;
          border: 0;
          background: #f5cb53;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          text-decoration: none;
          color: #5d3a16;
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }
        button:hover,
        .download-button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }
        button:disabled,
        .download-button:disabled {
          background: transparent;
          border-bottom-color: transparent;
          color: rgba(0, 0, 0, 0.5);
        }
        button:disabled:hover,
        .download-button:disabled:hover {
          box-shadow: none;
          cursor: default;
        }

        .message {
          font-size: 24px;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default InviteNeighborModal;
