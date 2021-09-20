import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import UseCoinButton from './UseCoinButton';

const Header = () => {
  return (
    <div className="header">
      <div className="logo">Exquisite Land</div>

      <div className="spacer" />

      <div className="canvas">Terra Masu</div>

      <div className="spacer" />

      <UseCoinButton />
      <ConnectWalletButton />

      <style jsx>{`
        .header {
          display: flex;
          padding: 10px 15px;
          align-items: center;
          gap: 10px;
        }
        .logo {
          font-size: 36px;
          text-transform: uppercase;
        }
        .canvas {
          font-size: 36px;
        }

        .spacer {
          flex: 1 1 auto;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Header);
