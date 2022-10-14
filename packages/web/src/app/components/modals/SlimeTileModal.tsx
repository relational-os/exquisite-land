import React, { useEffect, useRef, useState } from 'react';
import {
  EXQUISITE_LAND_CONTRACT_ADDRESS,
  SLIME_POOL_CONTRACT_ADDRESS,
  OPENSEA_URL,
  MINIMAL_FORWARDER_ADDRESS,
  SLIME_CONTRACT_ADDRESS
} from '@app/features/AddressBook';
import { useFetchTile } from '@app/features/Graph';
import { generateTokenID } from '@app/features/TileUtils';
import {
  useAccount,
  useSignTypedData,
  useProvider,
  useContract,
  useSigner,
  useBalance
} from 'wagmi';

import SlimePoolsABI from '@sdk/abis/SlimePools.abi.json';
import MinimalForwarderABI from '@sdk/abis/MinimalForwarder.abi.json';
import useTileLoadingStore from '@app/features/useTileLoadingStore';
import { useFetchSlimePools } from '@app/features/Canvas2Graph';

import CachedENSName from '../CachedENSName';
import Button from '../Button';

const SUBMITTING_LOADING_MESSAGE = 'Sliming...';

import { ForwardRequest } from '@app/utils/signer';
import { SlimeEvent } from '../canvas/SlimeCanvas';

const TileModal = ({
  x,
  y,
  closeModal
}: {
  x: number;
  y: number;
  closeModal: () => void;
}) => {
  const { tile } = useFetchTile(x, y);
  const [slimeAmount, setSlimeAmount] = useState(0);
  const svgContainer = useRef<HTMLDivElement | null>(null);
  const { address, connector: activeConnector } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {data} = useFetchSlimePools();
  const tileSlimePoolIndex = data?.slimePools?.findIndex((pool: SlimeEvent) => pool.id == tile?.id);
  const tileSlimePool = data?.slimePools?.[tileSlimePoolIndex];

  const tileLoadingStore = useTileLoadingStore();
  const forwarderInstance = useContract({
    addressOrName: MINIMAL_FORWARDER_ADDRESS,
    contractInterface: MinimalForwarderABI,
    signerOrProvider: provider
  });

  const slimePoolsInstance = useContract({
    addressOrName: SLIME_POOL_CONTRACT_ADDRESS,
    contractInterface: SlimePoolsABI,
    signerOrProvider: provider
  });

  const { data: slimeBalance } = useBalance({
    addressOrName: address,
    token: SLIME_CONTRACT_ADDRESS
  });

  const insufficientSlime = Number(slimeBalance?.value.toString()) < Number(slimeAmount);

  useEffect(() => {
    if (svgContainer.current) {
      svgContainer.current.innerHTML = tile?.svg || '';
    }
  }, [tile?.svg]);

  const { signTypedDataAsync } = useSignTypedData();

  const slimeTile = async (event: any) => {
    if (!activeConnector) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);

    // todo: check if user has enough slime
    // todo: invalidate on 0 amount

    // todo:
    // await switchChain(activeConnector);

    const from = await signer?.getAddress();
    const nonce = await forwarderInstance.getNonce(from);
    const data = slimePoolsInstance?.interface?.encodeFunctionData(
      'poolSlime',
      [tile.id, slimeAmount]
    );

    const values = {
      from: from?.toLowerCase(),
      to: slimePoolsInstance.address.toLowerCase(),
      value: 0,
      // Maybe to real gas calculation
      gas: 1e6,
      nonce: nonce.toString(),
      data
    };

    const dataToSign = {
      domain: {
        name: 'MinimalForwarder',
        version: '0.0.1',
        verifyingContract: forwarderInstance.address,
        chainId: 80001
      },
      types: {
        ForwardRequest
      },
      primaryType: 'ForwardRequest',
      value: values
    };

    const signature = await signTypedDataAsync?.(dataToSign);
    console.log({ signature });

    const payload = {
      request: values,
      signature
    };

    const url = process.env.NEXT_PUBLIC_AUTOTASK_WEBHOOK_URL;
    if (!url) return;

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 200) {
      tileLoadingStore.addTileTimer(x, y);

      // using loaderstate
      setLoading(false);
      closeModal();

      return;
    } else {
      setErrorMessage('slime no flow');
      // console.log('response', response);
    }

    setLoading(false);
  };

  return (
    <div className="tile-modal">
      {tile ? (
        <>
          <div className="left">
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
            <div className="slime-meta">
              <h3>[{tile.x}, {tile.y}]</h3>
              {tileSlimePool && (
                <span>Rank #{tileSlimePoolIndex+1} with {tileSlimePool?.totalSlime} slime pooled</span>
              )}
            </div>

            <div className="slime-content">
              <span>How much slime to pool?</span>
              {insufficientSlime && 
              (
                <span className="insufficient-slime">not enough slime!</span>
              )}
              <span className="slime-content-pool-control">
                <input
                  value={slimeAmount}
                  onChange={(e) => {
                    setSlimeAmount(Number(e.target.value));
                  }}
                  placeholder="00"
                ></input>
                <button
                  onClick={(e) => {
                    setSlimeAmount(
                      Number(slimeBalance?.value?.toString()) || 0
                    );
                  }}
                  className="slime-content-button-max"
                >
                  MAX
                </button>
              </span>
              <Button
                className="slime-it"
                onClick={slimeTile}
                disabled={!slimeAmount || insufficientSlime}
              >
                {loading ? SUBMITTING_LOADING_MESSAGE : 'slime it!'}
              </Button>
              {errorMessage && <span className="">{errorMessage}</span>}
              <span className={!address ? "transparent-balance" : ""}>slime balance: §{slimeBalance?.value.toString()}</span>
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
          border-left: 2px solid #7cc45d;
          border-right: 2px solid #7cc45d;
          padding: 1.5rem;
          background-image: url(/graphics/slime-curtain-bottom.svg),
            url(/graphics/slime-curtain-top.svg);
          background-repeat: repeat-x, repeat-x;
          background-position: bottom left, top left;
          box-sizing: border-box;
        }

        .slime-content span {
          margin: 1rem 0;
          font-size: 24px;
          font-family: inherit;
        }

        .insufficient-slime {
          color: red;
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
          color: #7cc45d;
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
          color: #7cc45d;
        }

        .slime-it {
          background: #7cc45d !important;
        }

        .slime-it:disabled {
          user-select: none !important;
          cursor: pointer !important;
        }

        .left {
          flex: 1;
        }

        .right {
          flex: 1;
          flex-direction: column;
          display: flex;
          margin: auto 0 auto 2.5rem;
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

        .transparent-balance {
          opacity: 0;
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
