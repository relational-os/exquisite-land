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
        .signMessage('I HEREBY RELEASE THE GORBLIN');
      console.log(sig);
      setState('complete');
    }

    // TODO hit endpoint to release the gorblin
  };

  return (
    <div className="gorblinmodal">
      {state == 'initial' ? (
        <div className="gorblin-container">
          <h1 className="title">
            the gorblin has a<br /> deal for you
          </h1>
          <img src="/graphics/gorblin.png" className="tile-image" />
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
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      ) : state == 'sign' ? (
        <div className="gorblin-container">
          <h1 className="title gorblin">woah, really?</h1>
          <img src="/graphics/gorblin.png" className="tile-image" />
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
          <img src="/graphics/gorblin.png" />
          <div className="gorblin-countdown">
            <h1>gorblin inbound: 23:00:24</h1>

            <h1 className="gorblin">lfg! i'm gonna coin the communal ass</h1>
          </div>
        </div>
      )}
      <style jsx>{`
        .gorblin-container {
          width: min(90vw, 500px);
          text-align: center;
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
          width: 300px;
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
          margin-top: 0.5rem;
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
        .gorblin-mode img {
          width: 70vw;
          align-self: flex-end;
        }
      `}</style>
    </div>
  );
};

export default GorblinModal;
