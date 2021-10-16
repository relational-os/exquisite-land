import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import OpenTransactionHistoryButton from './OpenTransactionHistoryButton';
import UseCoinButton from './UseCoinButton';

const Header = () => {
  return (
    <div className="header">
      <div className="logo">Exquisite Land</div>

      <div className="spacer" />

      <div className="spacer" />

      <OpenTransactionHistoryButton />
      <UseCoinButton />
      <ConnectWalletButton />

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          display: flex;
          padding: 10px 15px;
          align-items: center;
          gap: 10px;
          z-index: 111;
        }
        .logo {
          font-size: 32px;
          text-transform: uppercase;
          color: #d0b094;
        }
        .canvas {
          font-size: 32px;
          color: #eee;
          text-shadow: 0 -1px #000;
        }

        .spacer {
          flex: 1 1 auto;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Header);
