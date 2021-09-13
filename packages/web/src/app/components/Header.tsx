import useStore from '@app/features/State';
import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';

const canvases = Array.from(Array(16).keys());

const Header = () => {
  const setActiveCanvas = (id: number) =>
    useStore.setState({ activeCanvas: id });

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

      <style jsx>{`
        .header {
          display: flex;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default Header;
