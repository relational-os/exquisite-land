import React, { useEffect, useRef, useState, useMemo }  from 'react';
import {
  EXQUISITE_LAND_CONTRACT_ADDRESS,
  SLIME_CONTRACT_ADDRESS, 
  SLIME_POOL_CONTRACT_ADDRESS,
  OPENSEA_URL
} from '@app/features/AddressBook';
import { useFetchTile } from '@app/features/Graph';
import { generateTokenID } from '@app/features/TileUtils';
import {
  useNetwork,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  usePrepareContractWrite,
} from "wagmi";

import SlimePoolsABI from '@sdk/abis/SlimePools.abi.json';

import CachedENSName from '../CachedENSName';
import Button from '../Button';
import { defaultAbiCoder } from '@ethersproject/abi';

const CONTRACT_SUBMITTING_LOADING_MESSAGE = "Submitting...";
const TRANSACTION_WAITING_LOADING_MESSAGE = "Confirming...";
const GRAPH_POLLING_LOADING_MESSAGE = "Finalizing...";

const TileModal = ({ x, y }: { x: number; y: number }) => {
  const { tile } = useFetchTile(x, y);

  const [slimeAmount, setSlimeAmount] = useState(0);

  const svgContainer = useRef<HTMLDivElement | null>(null);
  const { connector: activeConnector } = useAccount();
  const { chain: activeChain } = useNetwork();

  useEffect(() => {
    if (svgContainer.current) {
      svgContainer.current.innerHTML = tile?.svg || ''
    }
  }, [tile?.svg])

  const { config: contractConfig } = usePrepareContractWrite({
    addressOrName: SLIME_POOL_CONTRACT_ADDRESS,
    contractInterface: SlimePoolsABI,
    functionName: "poolSlime",
    args: [tile.id, slimeAmount],
  });

  const {
    data: contractData,
    write,
    isLoading: isLoadingWrite,
  } = useContractWrite(contractConfig);

  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      enabled: Boolean(contractData?.hash),
      confirmations: 1,
      hash: contractData?.hash,
      wait: contractData?.wait,
      onSuccess(contractData) {
        const event = defaultAbiCoder.decode(
          ["uint32", "uint256"],
          contractData.logs[1].data
        );

        console.log('event', event);
      },
    });

  const slimeTile = async () => {
    if (!activeConnector) {
      throw new Error("Wallet not connected");
    }

    // await switchChain(activeConnector);

    write?.();
  };

  const isPollingForCanvas = isTransactionSuccess;

  const isLoading =
    isLoadingWrite || isTransactionLoading || isPollingForCanvas;

  const publishButtonLabel = useMemo(() => {
    if (isLoading && isLoadingWrite) {
      return CONTRACT_SUBMITTING_LOADING_MESSAGE;
    }
    if (isLoading && isTransactionLoading) {
      return TRANSACTION_WAITING_LOADING_MESSAGE;
    }
    if (isLoading && isPollingForCanvas) {
      return GRAPH_POLLING_LOADING_MESSAGE;
    }

  const slimeTile = () => {
    console.log("slimed")
  }


    // if (activeChain?.id !== ) {
    //   return "Switch Chain";
    // }

    return "Publish";
  }, [
    isLoading,
    isLoadingWrite,
    isTransactionLoading,
    isPollingForCanvas,
  ]);

  return (
    <div className="tile-modal">
      {tile ? (
        <>
      <div className='left'>
        {tile.svg ? (
          <div className="tile-image" ref={svgContainer} />
        ) : (
          <img
            src={`/api/tiles/terramasu/${x}/${y}/img`}
            className="tile-image"
          />
        )}
        <div className="meta">
          <a href="#" className="title">
            [{x},{y}] by <CachedENSName address={tile.owner.id} />
          </a>
          <div className="spacer"></div>
          <a
            href={`${OPENSEA_URL}${EXQUISITE_LAND_CONTRACT_ADDRESS}/${generateTokenID(
              x,
              y
            )}`}
            className="button"
            target="_blank"
          >
            <img src="/graphics/icon-opensea.svg" /> OpenSea
          </a>

        </div>
      </div>
      <div className="right">
        <div className='slime-meta'>
          <h3>[15,10]</h3>
          <span>Rank #5 with x slime pooled</span>
        </div>

        <div className='slime-content'>
          <span>How much slime to pool?</span>
          <span className="slime-content-pool-control">
            <input onChange={(e) => {setSlimeAmount(Number(e.target.value))}} placeholder='00'></input>
            <button className ="slime-content-button-max">MAX</button>
          </span>
          <Button className='slime-it' onClick={slimeTile}>
            slime it!
          </Button>
          <span>slime balance: 323</span>
        </div>
      </div>
     </>
      ) : (
        <>
          <h1 className="title">loading</h1>
        </>
      )}
      <style jsx>{`
        .slime-content {
          flex-direction: column;
          display: flex;
          color: white;
          border-left: 2px solid #7CC45D;
          border-right: 2px solid #7CC45D;
          padding: 1.5rem;
          background-image: url(/graphics/slime-curtain-bottom.svg), url(/graphics/slime-curtain-top.svg);
          background-repeat: repeat-x, repeat-x;
          background-position: bottom left, top left;
          box-sizing: border-box;
        }

        .slime-content span {
          margin: 1rem 0;
          font-size: 24px;
          font-family: inherit;
        }

        .slime-content-button-max {
          position: absolute;
          right: 1rem;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 24px;
          font-family: inherit;
          top: 0;
          bottom: 0;
          margin: auto;
        }

        .slime-content-pool-control {
          position: relative;
          line-height: 1;
        }

        .slime-content input {
          text-align: center;
          border: 0;
          padding: 8px 16px;
          font-size: 24px;
          font-family: inherit;
        }

        .slime-content span:last-of-type {
          color: #7CC45D;
        }

        .slime-meta {
          flex-direction: column;
          display: flex;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.5rem;
          font-size: 24px;
        }

        .slime-meta span {
          color: #7CC45D;
        }

        .left {
          flex: 1;
        }
      
        .right {
          flex: 1;
          flex-direction: column;
          display: flex;
          margin: auto  0 auto 2.5rem;
          padding: 1.25rem;
          text-align: center;
        }
        .tile-modal {
          display: flex;
          flex-direction: row;
        }
        .title {
          padding-bottom: 0.75rem;
          text-align: center;
          color: #fff;
          padding: 8px 0;
          text-decoration: none;
        }
        .title:hover {
          text-decoration: underline;
        }
        .title:hover::after {
          content: ' 🔗';
          position: absolute;
          margin-left: 0.5rem;
        }
        .tile-image {
          min-width: 512px;
          min-height: 512px;
          max-width: 512px;
          max-height: 512px;
          width: 100%;
          height: auto;
          image-rendering: pixelated;
          background: #222;
        }
        @media (max-width: 768px) {
          .tile-image {
            min-width: 375px;
            min-height: 375px;
          }
        }
        .meta {
          display: flex;
          margin: 0.5rem 0;
          justify-content: space-between;
          gap: 1rem;
          font-size: 1.25rem;
        }

        .spacer {
          flex: 1;
        }

        h3 {
          margin-top: 0;
        }

        a.button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #ddd;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
          text-decoration: none;
        }
        a.button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }
        a.button img {
          width: 16px;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default TileModal;
