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
  const [longWait, setLongWait] = useState(false);

  const coinGenerated = useTransactionsStore((state) => {
    const tx = state.transactions.find((tx) => tx.x == x && tx.y == y);
    if (tx && tx.type == 'invite-neighbor') return true;
    return false;
  });

  useEffect(() => {
    if (coinGenerated) {
      setCoinGenerated(true);
    }
  });

  useEffect(() => {
    if (tileToInvite?.status == OpenNeighborStatus.COIN_GENERATED) {
      setCoinGenerated(true);

      // UNCOMMENT THIS TO SEE REGENERATION FLOW UI
      // setCoinGenerated(false);
    }
  }, [tileToInvite]);

  const inviteNeighborClicked = async () => {
    setLongWait(false);
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
    setTimeout(() => {
      setLongWait(true);
    }, 5000);

    if (signature) {
      setGeneratingCoin(true);
      const tx = await submitTx(dataToSign, signature);
      useTransactionsStore.getState().addTransaction({
        title: `Generating invite for tile [${x},${y}]`,
        hash: tx.hash,
        status: 'pending',
        date: new Date(),
        type: 'invite-neighbor',
        x: x,
        y: y,
        account
      });
      console.log(tx.hash);
      const receipt = await tx.wait(2);
      console.log(receipt);
      setCoinGenerated(true);
      setLongWait(false);
    }
  };

  return (
    <div className="invite-neighbor-modal">
      <div className="message">
        Invite a neighbor to [{x},{y}]
      </div>

      {isCoinGenerated ? (
        <>
          <div className="download-coin-container">
            <div className="bg-circle"></div>
            <img
              src={`/api/land-granter/generate?tokenId=${generateTokenID(
                x,
                y
              )}&address=${account}`}
              width={250}
              height={250}
              className="coin"
            />
          </div>
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
          {longWait && (
            <div style={{ color: 'rgba(0,0,0,0.5)' }}>
              (hang tight, this can take a bit)
            </div>
          )}
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

        .download-coin-container {
          position: relative;
          min-height: 250px;
        }
        .download-coin-container img {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 2222;
          margin: auto;
        }

        .bg-circle {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 180px;
          height: 180px;
          margin: auto;
          z-index: 1;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.3);
        }

        .saveas {
          font-size: 0.9rem;
          margin: 0 0 0.6rem;
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
