import React, { useState } from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import OpenTransactionHistoryButton from './OpenTransactionHistoryButton';
import UseCoinButton from './UseCoinButton';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    <div className="header">
      <div className="logo jaunt" onClick={() => setMenuOpen(!isMenuOpen)}>
        XQST&#9776;
      </div>

      <div className="spacer" />

      <OpenTransactionHistoryButton />
      <UseCoinButton />
      <ConnectWalletButton />

      <div className="menu">
        <div className="menu-items">
          <div className="menu-header">
            <button className="close" onClick={() => setMenuOpen(!isMenuOpen)}>
              X
            </button>
          </div>
          <div className="menu-logo jaunt">
            Exquisite
            <br />
            Land
          </div>
          <div>
            <a href="">About</a>
          </div>
          <div>
            <a href="">FAQ</a>
          </div>
          <div>
            <a href="">Discord</a>
          </div>
          <div>
            <a href="">Tweeter</a>
          </div>
        </div>
        <div className="menu-footer">
          <a href="https://relational.fyi" target="_blank">
            A Relational Game
          </a>
        </div>
      </div>

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
          cursor: pointer;
        }
        .spacer {
          flex: 1 1 auto;
        }
        .menu {
          position: fixed;
          top: 3rem;
          left: 0.5rem;
          width: 25vw;
          height: 90vh;
          padding: 0 1rem;
          background: #161414ed;
          display: ${isMenuOpen ? 'block' : 'none'};
          backdrop-filter: blur(4px);
          border-radius: 4px;
        }

        .menu-items {
          font-size: 1.5rem;
        }
        .menu-items a {
          color: #fff;
        }

        .menu-logo {
          padding: 1rem 0;
          color: #d0b094;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Header);
