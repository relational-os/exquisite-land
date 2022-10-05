import React, { useEffect, useState } from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import DiscordMessagesModal from './modals/DiscordMessagesModal';
import TransactionHistoryModal from './modals/TransactionHistoryModal';
import useTransactionsStore from '@app/features/useTransactionsStore';
import { useWallet } from '@gimmixorg/use-wallet';
import { useFetchSlimePools } from '@app/features/Canvas2Graph';

const SlimeHeader = () => {
  const { account } = useWallet();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDiscordFeedOpen, setDiscordFeedOpen] = useState(false);
  const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
  const [isActivityFeedOpen, setActivityFeedOpen] = useState(false);
  const transactionCount = useTransactionsStore(
    (state) => state.transactions.length
  );

  const { data } = useFetchSlimePools();
  console.log({data})

  return (
    <div className="header">
      <div className="logo jaunt" onClick={() => setMenuOpen(!isMenuOpen)}>
        XQST&#9776;
      </div>

      <div className="spacer" />

      <button
        className="leaderboard-button"
        onClick={() => setLeaderboardOpen(!isLeaderboardOpen)}
      >Leaderboard
      </button>

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

      {transactionCount > 0 && (
        <button
          className="activity-button"
          onClick={() => setActivityFeedOpen(!isActivityFeedOpen)}
        >
          <img src="/graphics/icon-activity.svg" />
        </button>
      )}

      {/* <UseCoinButton /> */}
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
            <a href="" style={{ display: 'none' }}>
              &#x3e; What is this land?
            </a>
          </div>
          <div>
            <a href="https://exquisiteland.substack.com" target="_blank">
              &#x3e; Updates
            </a>
          </div>
        </div>

        <div className="spacer"></div>

        <ul className="land-carousel">
          <li className="active">
            <div>CANVAS 1</div>
            <div className="jaunt">TERRA MASU</div>
          </li>
          <li>
            <div>CANVAS 2</div>
            <div></div>
            <span className="tooltip">in development!</span>
          </li>
          <li>
            <div>CANVAS 3</div>
            <div></div>
          </li>
          <li>
            <div>CANVAS 4</div>
            <div></div>
          </li>
          <li>
            <div>CANVAS 5</div>
            <div></div>
          </li>
          <li>
            <div>CANVAS 6</div>
            <div></div>
          </li>
          <li>
            <div>CANVAS 7</div>
            <div></div>
          </li>
          <li>
            <div>CANVAS 8</div>
            <div></div>
          </li>
          <li>
            <div>CANVAS 9</div>
            <div></div>
          </li>
          <li>
            <div>CANVAS 10</div>
            <div></div>
          </li>
          <li>
            <div>CANVAS 11</div>
            <div></div>
          </li>
          <li>
            <div>CANVAS 12</div>
            <div></div>
          </li>
        </ul>

        <div className="spacer"></div>

        <div className="menu-items social">
          <div className="spacer"></div>
          {account && (
            <div>
              <a href="https://discord.gg/pma4YtD6xW" target="_blank">
                <img src="/graphics/icon-discord.svg" /> Discord
              </a>
            </div>
          )}
          <div>
            <a href="https://twitter.com/exquisiteland" target="_blank">
              <img src="/graphics/icon-twitter.svg" /> Twitter
            </a>
          </div>
          <div>
            <a href="https://www.reddit.com/r/exquisiteland/" target="_blank">
              r/exquisiteland
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
          className={`join ${!account ? 'join-disabled' : ''}`}
          target="_blank"
        >
          <img src="/graphics/icon-discord.svg" />{' '}
          {!account ? 'Connect Wallet to join Discord' : 'Join the Discord'}
        </a>
      </div>

      <div className="leaderboard">
        <div className="cell leaderboard-slime-top"> test</div>
        <div className="cell col-3"> </div>        
        <div className="cell leaderboard-bg">
          <button
              className="close jaunt"
              onClick={() => setLeaderboardOpen(!isLeaderboardOpen)}
            >
              X
          </button>
          <h3>SLIME POOLS</h3>
          <div className="slime-days-remaining"><h4>6 days remaining!</h4></div>
          <div>
              <span className="leaderboard-tileList">
                <img src="/graphics/coin-gorblin.gif" />
                <span className="leaderboard-tileList-title">Leaderboard</span>
                <img src="/graphics/coin-gorblin.gif" />
              </span>
              <table>
                {
                  data?.map((pool: any) => (<>
                    <tr>
                      <td>
                        {pool.id}. 
                      </td>
                      {/* <td className="leaderboard-pool-coords">
                        [{data.x}, {data.y}]
                      </td> */}
                      <td className="leaderboard-pool-total">
                      §{pool.totalSlime}
                      </td>
                    </tr>
                  </>))
                }
              </table>
          </div>
        </div>
        <div className="cell leaderboard-slime-bottom"> </div>
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
          user-select: none;
          -webkit-touch-callout: none;
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
          left: 0.75rem !important;
          right: auto;
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
          position: relative;
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
        .land-carousel li .tooltip {
          position: absolute;
          height: 120px;
          line-height: 120px;
          top: 0; 
          left: 0; right: 0;
         color: #fff; 
         text-align: center;
         animation: tada 1.2s infinite;
        }

        @keyframes tada {
   0% {transform: scale(1);} 
   10%, 20% {transform: scale(0.9) rotate(-3deg);} 
   30%, 50%, 70%, 90% {transform: scale(1.1) rotate(3deg);} 
   40%, 60%, 80% {transform: scale(1.1) rotate(-3deg);} 
   100% {transform: scale(1) rotate(0);} 
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
          width: 35vw;
          min-width: 360px;
          height: calc(100vh - 1rem);
          background: #3f4481fb;
          display: ${isDiscordFeedOpen ? 'flex' : 'none'};
          overflow-y: auto;
          border-radius: 4px;
          flex-direction: column;
        }

        .leaderboard {
          position: fixed;
          top: 0.5rem;
          right: 0.5rem;
          width: 35vw;
          min-width: 360px;
          height: calc(100vh - 1rem);
          display: ${isLeaderboardOpen ? 'grid' : 'none'};
          grid-template-columns: 18pt auto;
          grid-template-rows: 18pt auto 18pt;
          overflow-y: auto;
          border-radius: 4px;
          flex-direction: column;
          text-align: center;
        }

        .cell {
          // border: 1px solid red;
          display: grid-cell;
        }

        .col-3 {
          grid-column: 1;
          grid-row: 2 / 3;
          background-image: url(/graphics/slime-curtain-left.png);
          background-repeat: repeat-y;
          background-position: top left;
          background-size: 100% auto;
        }

        .leaderboard-bg { 
          background: #7CC45D;
        }

        .leaderboard-slime-top {
          background-image: url(/graphics/slime-curtain-top.png);
          background-position: top left;
          background-size:  auto 100%;
          background-repeat: repeat-x;
          grid-column: 1 / 3;
        }

        .leaderboard-slime-bottom {
          background-image: url(/graphics/slime-curtain-bottom.png);
          background-position: top left;
          background-size: auto 100%;
          background-repeat: repeat-x;
          grid-column: 1 / 3;
        }

        .slime-days-remaining {
          font-size: 250%;
          margin: 0 1rem 1rem 1rem;
          padding: 0;
          color: #AFFF83;
          background-color: #397320;
          background-image: url(/graphics/slime-curtain-top.png), url(/graphics/slime-curtain-bottom.png), url(/graphics/slime-curtain-left.png), url(/graphics/slime-curtain-right.png);
          background-repeat: repeat-x, repeat-x, repeat-y, no-repeat;
          background-position: bottom left, top left, top right, top left;
          background-size: auto 18pt, auto 18pt, 18pt auto, 11pt auto;
        }

        .slime-days-remaining h4 {
          padding: 2rem 0;
          margin: 0;
          font-weight: 200;
          display: block;  
        }

        .leaderboard h3 {
          font-size: 200%;
          margin: 0.75rem 0 1rem 0;
          color: #fff;
          text-shadow: 3px 4px 0 rgba(0, 0, 0, 0.25);
        }

        .leaderboard-button {
          border: 0;
          background: none;
          color: #7CC45D;
          font-family: inherit;
          font-size: 24px;
        }

        .leaderboard-button:hover {
          box-shadow: none;
          color: #76ff3b;
        }

        .leaderboard table {
          color: #fff;
          margin: 1.5rem 3rem;
          font-size: 150%;
          width: 27vw;
          text-shadow: 3px 4px 0 rgba(0, 0, 0, 0.25);
        }

        .leaderboard-tileList-title {
          opacity: 0.65;
        }

        .leaderboard-tileList {
          color: #fff;
          font-size: 175%;
          text-transform: uppercase;     
        }

        .leaderboard-tileList img {
          width: 2.5rem;
          margin: 0 1rem -.75rem 1rem;
        }

        .leaderboard-pool-total {
          text-align: right;
        }

        .leaderboard-pool-coords {
          text-align: left;
        }

        button.close {
          position: fixed;
          top: 3rem;
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

        .discord-feed a.join-disabled {
          background-color: hsl(235, 7%, 50%);
          pointer-events: none;
          color: #999
        }

        .join-disabled img {
          opacity: 0.5;
        }

        .activity-feed {
          position: fixed;
          top: 0.5rem;
          right: 0.5rem;
          width: 35vw;
          min-width: 360px;
          height: calc(100vh - 1rem);
          background: #3f4481fb;
          display: ${isActivityFeedOpen ? 'block' : 'none'};
          overflow-y: auto;
          border-radius: 4px;
        }
        button.activity-button {
          display: block;
          height: 44px;
          padding: 3px 14px 0;
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
        @media (max-width: 768px) {
          .header {
            gap: 10px;
          }
          .discord-feed {
            width: calc(100% - 20 px);
            top: 10 px;
            left: 10 px;
            height: calc(100% - 20 px);
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

export default React.memo(SlimeHeader);
