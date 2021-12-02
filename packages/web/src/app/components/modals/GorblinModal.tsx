import { useWallet } from '@gimmixorg/use-wallet';
import React from 'react';

type GorblinModalState = 'initial' | 'sign' | 'complete';

const GorblinModal = () => {
  const { provider } = useWallet();

  const [state, setState] = React.useState<GorblinModalState>('initial');

  const signAndInviteGorblin = async () => {
    if (provider) {
      const sig = await provider
        .getSigner()
        .signMessage(
          'I HEREBY INVITE THE GORBLIN IN AND ASSUME ALL RESPONSIBILITY FOR ANY SLIMINGS'
        );
      console.log(sig);
      setState('complete');
    }

    // TODO hit endpoint to release the gorblin
  };

  return (
    <div className="gorblinmodal">
      {state == 'initial' ? (
        <div className="gorblin-container">
          <div className="gorblin-countdown-header step1">
            <span></span>
            <div></div>
            <span></span>
          </div>
          <div className="gorblin-countdown step1">
            the gorblin has a<br /> deal for you
          </div>
          <div className="spacer"></div>
          <img src="/graphics/gorblin.png" className="tile-image" />
          <div className="spacer"></div>
          <p className="dialog">
            lemme into the discord, it’ll be super chill trust me ;)
          </p>
          {/* TODO change the URL and what to do after the modal is closed? */}
          <button
            // href={`${OPENSEA_URL}${EXQUISITE_LAND_CONTRACT_ADDRESS}/${generateTokenID(
            //   x,
            //   y
            // )}`}
            onClick={() => {
              setState('sign');
            }}
            className="button"
          >
            let the gorblin in?
          </button>
          <div className="spacer"></div>
        </div>
      ) : state == 'sign' ? (
        <div className="gorblin-container">
          <h1 className="title gorblin">woah, really?</h1>
          <div className="spacer"></div>
          <img src="/graphics/gorblin.png" className="tile-image" />
          <div className="spacer"></div>
          <p className="dialog">
            the stuarts are gonna hate this. imma get real weird
          </p>
          <button
            onClick={() => {
              signAndInviteGorblin();
            }}
            className="button"
          >
            sign to let the gorblin in
          </button>
          <button
            onClick={() => {
              setState('initial');
            }}
            className="cancel"
          >
            uhhh, i'm not so sure
          </button>
        </div>
      ) : (
        <div className="gorblin-mode">
          <img src="/graphics/gorblin.png" className="successful-gorblin" />
          <div className="gorblin-countdown-container">
            <div className="gorblin-countdown-header gorblin">
              <span></span>
              gorblin inbound!
              <span></span>
            </div>
            <div className="gorblin-countdown">
              <img src="/graphics/coin-gorblin.gif" width="24" />
              <span>23:00:24</span>
              <img src="/graphics/coin-gorblin.gif" width="24" />
            </div>

            <div className="spacer"></div>
            <h1 className="message gorblin">
              yessss.
              <br />
              imma coin ya’lls asses so good!
            </h1>
            <div className="spacer"></div>
          </div>
        </div>
      )}
      <style jsx>{`
        .gorblin-container {
          width: min(90vw, 500px);
          height: 100vh;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .title {
          color: #fff;
          padding: 8px 0;
          text-align: center;
        }
        .gorblin {
          color: #b6d17d;
        }

        .dialog {
          color: #b6d17d;
          text-align: center;
          font-size: 2rem;
        }

        .tile-image {
          min-width: 300px;
          min-height: 300px;
          height: auto;
          image-rendering: pixelated;
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

        button.button {
          padding: 8px 1.5rem;
          border: 0;
          outline: 0;
          background: #7cc45d;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
          text-decoration: none;
          text-align: center;
          font-size: 1.5rem;
        }
        button.button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }
        button.cancel {
          margin: 0.5rem 0 1rem;
          font-family: inherit;
          cursor: pointer;
          background: transparent;
          border: 0;
          outline: 0;
          padding: 0.5rem;
          color: #ddd;
          font-size: 1.4rem;
        }

        .gorblin-mode {
          width: 90vw;
          height: 100vh;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        .gorblin-mode img.successful-gorblin {
          width: 70vw;
          align-self: flex-end;
        }
        .gorblin-countdown-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 40vw;
          text-align: center;
        }

        .gorblin-countdown-container .message {
          font-size: 2.5rem;
        }

        .gorblin-countdown-header {
          height: 5rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        .gorblin-countdown-header span {
          margin: 0 2rem;
          width: 6px;
          height: 100%;
          background: #3f2832;
        }
        .gorblin-countdown-header div {
          width: 100px;
        }
        .gorblin-countdown-header.step1 {
          height: 2rem;
        }

        .gorblin-countdown {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          background: #3f2832;
        }
        .gorblin-countdown span {
          padding: 0.75rem 0;
          flex: 2;
          color: #fff;
          text-shadow: 0 0 1px #000;
          text-align: center;
          font-size: 3rem;
        }
        .gorblin-countdown img {
          margin: 1rem;
        }

        .gorblin-countdown.step1 {
          width: 60%;
          padding: 1rem;
          margin-bottom: 1rem;
          font-size: 2rem;
          color: #bfa4a4;
        }
      `}</style>
    </div>
  );
};

export default GorblinModal;
