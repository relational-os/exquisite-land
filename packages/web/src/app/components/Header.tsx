import useOpenNeighborsForWallet from '@app/features/useOpenNeighborsForWallet';
import useTilesInWallet from '@app/features/useTilesInWallet';
import { useWallet } from '@gimmixorg/use-wallet';
import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';

const Header = () => {
  const { account } = useWallet();
  const { tiles } = useTilesInWallet(account);
  const openNeighbors = useOpenNeighborsForWallet();
  console.log({ account, tiles, openNeighbors });
  return (
    <div className="header">
      <ConnectWalletButton />
      <button className="invite-button">have a coin?</button>
      <div className="spacer" />
      {account && (
        <div className="user-stats">
          <div className="open-neighbors">
            You have {openNeighbors.length} open neighbors
          </div>
          <div className="open-tiles">
            You have{' '}
            {tiles?.filter(tile => tile.status == 'UNLOCKED').length || '0'}{' '}
            open tiles [
            {tiles
              ?.filter(tile => tile.status == 'UNLOCKED')
              .map(tile => `${tile.x}, ${tile.y}`)
              .join(' & ')}
            ]
          </div>
        </div>
      )}
      <style jsx>{`
        .header {
          display: flex;
          padding: 10px;
        }
        .spacer {
          flex: 1 1 auto;
        }
        .user-stats {
          text-align: right;
        }

        button.invite-button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #ffe131;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }

        button.invite-button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }

        select {
          margin: 0 1rem;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Header);
