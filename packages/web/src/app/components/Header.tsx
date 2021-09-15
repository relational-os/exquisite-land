import useStore from '@app/features/State';
import useOpenNeighborsForWallet from '@app/features/useOpenNeighborsForWallet';
import useTilesInWallet from '@app/features/useTilesInWallet';
import { useWallet } from '@gimmixorg/use-wallet';
import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';

const canvases = Array.from(Array(16).keys());

const Header = () => {
  const setActiveCanvas = (id: number) =>
    useStore.setState({ activeCanvas: id });
  const { account } = useWallet();
  const { tiles } = useTilesInWallet(account);
  const openNeighbors = useOpenNeighborsForWallet();
  console.log({ userOwnedTiles: tiles, openNeighbors });
  return (
    <div className="header">
      <ConnectWalletButton />
      <select onChange={e => setActiveCanvas(parseInt(e.target.value))}>
        {canvases.map(canvas => {
          return (
            <option key={canvas} value={canvas}>
              Canvas {canvas}
            </option>
          );
        })}
      </select>
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
              .map(tile => `${tile.canvas?.id},${tile.x},${tile.y}`)
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
      `}</style>
    </div>
  );
};

export default Header;
