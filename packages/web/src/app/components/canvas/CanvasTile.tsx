import React, { useEffect, useState } from 'react';
import { useFetchTile } from '@app/features/Graph';
import useTilesInWallet from '@app/features/useTilesInWallet';
import { useWallet } from '@gimmixorg/use-wallet';
import {
  useOpenNeighborStore,
  OpenNeighborStatus
} from '@app/features/useOpenNeighborsForWallet';
import { LAND_GRANTER_CONTRACT_ADDRESS } from '@app/features/AddressBook';
import useTransactionsStore from '@app/features/useTransactionsStore';
import CachedENSName from '../CachedENSName';
import Lottie from 'react-lottie';
import * as animationData from '@app/graphics/gorblin-walk.json';

const CanvasTile = ({
  x,
  y,
  openEditor,
  openGenerateInvite,
  openTileModal,
  style
}: {
  x: number;
  y: number;
  openEditor?: () => void;
  openGenerateInvite?: () => void;
  openTileModal?: () => void;
  style?: React.CSSProperties;
}) => {
  const { tile } = useFetchTile(x, y);

  const { account } = useWallet();

  const { tiles: tilesOwned } = useTilesInWallet(account);
  const [isOwned, setOwned] = useState(false);
  const [pendingSvg, setPendingSvg] = useState<string | null>(null);
  const [isCoinGenerated, setIsCoinGenerated] = useState(false);

  const isInvitable = useOpenNeighborStore(
    (state) => !!state.openNeighbors.find((t) => t.x == x && t.y == y)
  );
  const inviteState = useOpenNeighborStore(
    (state) => state.openNeighbors.find((t) => t.x == x && t.y == y)?.status
  );

  const onClick = () => {
    if (pendingSvg && openTileModal) openTileModal();
    else if (isOwned && tile?.status == 'UNLOCKED' && openEditor) openEditor();
    else if (isInvitable && openGenerateInvite) openGenerateInvite();
    else if (tile?.status == 'LOCKED' && openTileModal) openTileModal();
  };

  const isPending = useTransactionsStore((state) =>
    state.transactions.find(
      (t) => t.x == x && t.y == y && t.type == 'create-tile'
      // &&
      // t.status != 'confirmed'
    )
  );

  const ownedTransaction = useTransactionsStore((state) =>
    state.transactions.find(
      (t) =>
        t.x == x &&
        t.y == y &&
        t.type == 'claim-coin' &&
        t.account?.toLowerCase() == account?.toLowerCase()
    )
  );

  const coinGenerated = useTransactionsStore((state) => {
    const tx = state.transactions.find((tx) => tx.x == x && tx.y == y);
    if (tx && tx.type == 'invite-neighbor') return true;
    return false;
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    const found = tilesOwned?.find((t) => t.x == x && t.y == y);
    if (found || (!found && ownedTransaction?.status == 'confirmed')) {
      setOwned(true);
    }
  }, [JSON.stringify(tilesOwned), ownedTransaction]);

  useEffect(() => {
    if (coinGenerated || inviteState == OpenNeighborStatus.COIN_GENERATED) {
      setIsCoinGenerated(true);
    }
  }, [coinGenerated, inviteState]);

  useEffect(() => {
    if (isPending) {
      fetch('/api/utils/pixels/png', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pixels: isPending.pixels! })
      })
        .then((r) => r.blob())
        .then((r) => setPendingSvg(URL.createObjectURL(r)));
    } else {
      setPendingSvg(null);
    }
  }, [isPending]);

  function renderTileSwitch(x: number, y: number) {
    if (x == 12 && y == 12) {
      return <Lottie options={defaultOptions} height={128} width={128} />;
    }
    if (x == 4 && y == 12) {
      if (tile?.svg != null) {
        return (
          <img
            src={`/api/tiles/terramasu/${x}/${y}/svg`}
            className="tile-image"
          />
        );
      } else {
        // NEXT GORBLIN TILE
        return <Lottie options={defaultOptions} height={128} width={128} />;
      }
    }
    return (
      tile?.svg && (
        <img
          src={`/api/tiles/terramasu/${x}/${y}/svg`}
          className="tile-image"
        />
      )
    );
  }

  return (
    <div id={`tile-${x}-${y}`} className="tile" onClick={onClick} style={style}>
      {renderTileSwitch(x, y)}
      {!tile?.svg && pendingSvg && (
        <img
          src={pendingSvg}
          width="100"
          height="100"
          className="tile-image"
        ></img>
      )}
      <div className="meta">
        <div className="coords">
          [{x},{y}]
        </div>
        {isOwned && <div className="owned">Your tile!</div>}
        <div className="deets">
          {!isInvitable && tile?.owner && (
            <div className="owner">
              {ownedTransaction ? (
                <CachedENSName address={account} />
              ) : tile.owner.id.toLowerCase() ==
                LAND_GRANTER_CONTRACT_ADDRESS.toLowerCase() ? (
                'UNCLAIMED'
              ) : (
                <CachedENSName address={tile.owner.id} />
              )}
            </div>
          )}
          {isInvitable && (
            <div className="invitable">
              <img src="/graphics/coin-spin.gif" />
              <button>{isCoinGenerated ? 'regenerate' : 'invite!'}</button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .tile {
          position: relative;

          background-color: ${isInvitable
            ? '#c066ea'
            : tile?.status == 'UNLOCKED'
            ? '#444'
            : '#333'};

          background-image: ${isInvitable
            ? '#c066ea'
            : tile?.status == 'UNLOCKED'
            ? `radial-gradient(circle, #333 1px, rgba(40, 40, 40, 0) 1px)`
            : 'radial-gradient(circle, #111 1px, rgba(0, 0, 0, 0) 1px)'};

          background-size: ${isInvitable
            ? '100% 100%'
            : tile?.status == 'UNLOCKED'
            ? '10% 10%'
            : '10% 10%'};

          background-image: ${isOwned &&
          'linear-gradient(-45deg, #ffe761, #fb922b)'};
          background-size: ${isOwned && '400% 400%'};
          animation: gradient ${isOwned && ' 3s ease infinite'};
          transition: all 0.15s ease-in-out;
          ${tile?.status == 'UNLOCKED' && 'box-shadow: inset 0 1px #333;'};
        }

        .tile:hover {
          background-color: ${isInvitable
            ? '#c066ea'
            : tile?.status == 'UNLOCKED'
            ? 'none'
            : 'none'};

          background-image: ${isInvitable
            ? ''
            : tile?.status == 'UNLOCKED'
            ? `none`
            : 'radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)'};

          cursor: grab;

          ${isOwned &&
          'background-image: linear-gradient(-45deg, #ffe761, #fb922b); cursor: pointer; '};
        }
        .tile-image {
          width: 100%;
          height: auto;
          image-rendering: pixelated;
        }

        .owned {
          position: absolute;
          bottom: 2.8rem;
          left: 1.4rem;
          padding: 0.2rem 0.5rem;
          background: #fff;
        }

        .owned:before {
          content: '';
          width: 0px;
          height: 0px;
          position: absolute;
          border-left: 12px solid #fff;
          border-right: 6px solid transparent;
          border-top: 6px solid #fff;
          border-bottom: 12px solid transparent;
          left: 36px;
          bottom: -12px;
        }

        svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        .meta {
          display: block;
          padding: 10px;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-size: 1.1rem;
          text-align: center;
          transition: all 0.15s ease-in-out;
        }

        .meta .coords {
          ${isInvitable
            ? 'color: #000;'
            : tile?.status == 'UNLOCKED'
            ? `position: relative; background: transparent; color: #000; height: auto; line-height: inherit;`
            : 'background: #333; color: #222; position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto; width: 52%; height: 36px; line-height: 36px;'};
          ${(tile?.svg || pendingSvg) &&
          'position: relative; background: transparent; color: #fff; height: auto; line-height: inherit;'};
        }

        .tile .meta {
          ${(tile?.svg || pendingSvg) && 'opacity: 0;'};
        }

        .tile:hover .meta {
          ${(tile?.svg || pendingSvg) &&
          'display: block; cursor: pointer; background: rgba(0,0,0,0.25); color:#fff; text-shadow: 2px 2px #000; opacity: 1;'};
        }

        .deets {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
        }

        .invitable img {
          display: block;
          width: 35%;
          height: auto;
          margin: 0 auto 8px;
        }

        .invitable button {
          padding: 6px 14px;
          border: 0;
          background: #f5cb53;
          font-size: 16px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: #5d3a16;
          border-bottom: 4px solid #843ea5;
        }

        .invitable button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(CanvasTile);
