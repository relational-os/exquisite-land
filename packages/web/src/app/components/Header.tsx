import React, { useState } from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import UseCoinButton from './UseCoinButton';
import DiscordMessagesModal from './modals/DiscordMessagesModal';
import TransactionHistoryModal from './modals/TransactionHistoryModal';
import useTransactionsStore from '@app/features/useTransactionsStore';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDiscordFeedOpen, setDiscordFeedOpen] = useState(false);
  const [isActivityFeedOpen, setActivityFeedOpen] = useState(false);
  const transactionCount = useTransactionsStore(
    (state) => state.transactions.length
  );

  return (
    <div className="header">
      <div className="logo jaunt" onClick={() => setMenuOpen(!isMenuOpen)}>
        XQST&#9776;
      </div>

      <div className="spacer" />

      {transactionCount > 0 && (
        <button
          className="activity-button"
          onClick={() => setActivityFeedOpen(!isActivityFeedOpen)}
        >
          log
        </button>
      )}
      <button
        className="discord-button"
        onClick={() => setDiscordFeedOpen(!isDiscordFeedOpen)}
      >
        <img src="/graphics/icon-discord.svg" className="discord-icon" />
        <img
          src="/graphics/icon-textballoon.svg"
          className="textballoon-icon"
        />
      </button>

      <UseCoinButton />
      <ConnectWalletButton />

      <div className="menu">
        <div className="menu-items">
          <div className="menu-header">
            <button
              className="close jaunt"
              onClick={() => setMenuOpen(!isMenuOpen)}
            >
              X
            </button>
          </div>
          <div className="menu-logo jaunt">
            Exquisite
            <br />
            &nbsp;&nbsp;&nbsp;Land
          </div>
          <div className="spacer"></div>
          <div>
            <a href="">&#x3e; What is this land?</a>
          </div>
          <div>
            <a href="">&#x3e; Frequently Asked</a>
          </div>
        </div>

        <div className="spacer"></div>

        <ul className="land-carousel">
          <li className="active">
            <div>LAND 01</div>
            <div className="jaunt">TERRA MASU</div>
          </li>
          <li>
            <div>LAND 02</div>
            <div></div>
          </li>
          <li>
            <div>LAND 03</div>
            <div></div>
          </li>
          <li>
            <div>LAND 04</div>
            <div></div>
          </li>
          <li>
            <div>LAND 05</div>
            <div></div>
          </li>
          <li>
            <div>LAND 06</div>
            <div></div>
          </li>
          <li>
            <div>LAND 07</div>
            <div></div>
          </li>
          <li>
            <div>LAND 08</div>
            <div></div>
          </li>
          <li>
            <div>LAND 09</div>
            <div></div>
          </li>
          <li>
            <div>LAND 10</div>
            <div></div>
          </li>
          <li>
            <div>LAND 11</div>
            <div></div>
          </li>
          <li>
            <div>LAND 12</div>
            <div></div>
          </li>
        </ul>

        <div className="spacer"></div>

        <div className="menu-items social">
          <div className="spacer"></div>
          <div>
            <a href="https://discord.gg/pma4YtD6xW" target="_blank">
              <img src="/graphics/icon-discord.svg" /> Discord
            </a>
          </div>
          <div>
            <a href="https://twitter.com/exquisiteland" target="_blank">
              <img src="/graphics/icon-twitter.svg" /> Twitter
            </a>
          </div>
          <div className="spacer"></div>
        </div>

        <div className="menu-footer">
          <a href="https://relational.fyi" target="_blank">
            A Relational Game
          </a>
        </div>
      </div>

      <div className="activity-feed">
        <button
          className="close jaunt"
          onClick={() => setActivityFeedOpen(!isActivityFeedOpen)}
        >
          X
        </button>
        <TransactionHistoryModal />
      </div>

      <div className="discord-feed">
        <button
          className="close jaunt"
          onClick={() => setDiscordFeedOpen(!isDiscordFeedOpen)}
        >
          X
        </button>
        <DiscordMessagesModal isOpen={isDiscordFeedOpen} />
        <a
          href="https://discord.gg/pma4YtD6xW"
          className="join"
          target="_blank"
        >
          <img src="/graphics/icon-discord.svg" /> Join the Discord
        </a>
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
          gap: 1rem;
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
        .discord-icon {
          width: 24px;
          margin-left: -3px;
        }
        .textballoon-icon {
          position: absolute;
          top: -3px;
          right: -7px;
          width: 20px;
        }

        .menu {
          position: fixed;
          top: 0.5rem;
          left: 0.5rem;
          width: calc(100vw - 1rem);
          height: calc(100vh - 1rem);
          padding: 0 1rem;
          background: #2a5cffec;
          display: ${isMenuOpen ? 'flex' : 'none'};
          backdrop-filter: blur(4px);
          border-radius: 4px;
          text-align: center;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
        }

        .menu-items button.close {
          position: fixed;
          top: 0.75rem;
          left: 0.5rem;
          background: transparent;
          outline: none;
          border: none;
          font-size: 32px;
          color: #fff;
          cursor: pointer;
        }
        .menu-items button.close:hover {
          box-shadow: none;
        }

        .menu .spacer {
          flex-grow: 1;
        }
        .menu-logo {
          font-size: 64px;
          padding: 1rem 0;
          color: #9fe9f3;
        }

        .menu-items {
          font-size: 2rem;
          display: flex;
          flex-direction: column;
        }
        .menu-items.social {
          font-size: 1rem;
          flex-direction: row;
          justify-content: space-around;
          gap: 1.5rem;
          line-height: 1.5rem;
          vertical-align: middle;
        }
        .menu-items a {
          color: #fff;
          text-decoration: none;
        }
        .menu a img {
          max-width: 24px;
        }

        .menu-items div {
          padding: 1rem 0;
        }

        .menu-footer {
          padding: 0 0 1rem;
        }
        .menu-footer a {
          color: #152455;
          text-decoration: none;
        }

        .land-carousel {
          display: flex;
          flex-direction: row;
          list-style: none;
          width: 100%;
          min-height: 140px;
          margin: 2rem 0 0 0;
          padding: 0;
          gap: 1.25rem;
          overflow-y: visible;
          overflow-x: auto;
        }
        .land-carousel li {
          color: #ffffff67;
          min-width: 180px;
          height: 120px;
          border: 2px dashed #ffffff67;
          display: flex;
          flex-direction: column;
        }
        .land-carousel li.active {
          color: #fff;
          border: 2px solid #fff;
        }
        .land-carousel li div:first-of-type {
          padding: 0.75rem 0;
        }
        .land-carousel li div:last-of-type {
          font-size: 2rem;
          padding: 0 0.5rem;
        }

         {
          /* move to component */
        }
        button.discord-button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #7189da;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }
        button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }
        .discord-feed {
          position: fixed;
          top: 0.5rem;
          right: 0.5rem;
          width: 30vw;
          min-width: 360px;
          height: calc(100vh - 1rem);
          background: #3f4481fb;
          display: ${isDiscordFeedOpen ? 'flex' : 'none'};
          overflow-y: auto;
          border-radius: 4px;
          flex-direction: column;
        }

        button.close {
          position: fixed;
          top: 1.2rem;
          right: 1.4rem;
          background: transparent;
          outline: none;
          border: none;
          font-size: 32px;
          color: #fff;
          cursor: pointer;
        }
        button.close:hover {
          box-shadow: none;
        }

        .activity-feed button.close {
          right: 1rem;
        }

        .discord-feed a.join {
          position: sticky;
          bottom: 0;
          left: 0;
          display: block;
          width: 100%;
          padding: 10px 0;
          background: #c066ea;
          font-size: 1.2rem;
          font-family: inherit;
          color: #fff;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
          text-align: center;
          text-decoration: none;
        }

        .discord-feed a.join img {
          width: 24px;
        }

        .activity-feed {
          position: fixed;
          top: 0.5rem;
          right: 0.5rem;
          width: 30vw;
          height: calc(100vh - 1rem);
          background: #3f4481fb;
          display: ${isActivityFeedOpen ? 'block' : 'none'};
          overflow-y: auto;
          border-radius: 4px;
        }
        button.activity-button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #7189da;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }
        /* ===== Scrollbar CSS ===== */
        /* Firefox */
        * {
          scrollbar-color: #ffffff67 #2247bf;
        }

        /* Chrome, Edge, and Safari */
        *::-webkit-scrollbar {
          height: 8px;
        }

        *::-webkit-scrollbar-track {
          background: #2247bf;
        }

        *::-webkit-scrollbar-thumb {
          background-color: #ffffff67;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Header);
