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
        .signMessage('I HERBY RELEASE THE GORBLIN');
      console.log(sig);
      setState('complete');
    }

    // TODO hit endpoint to release the gorblin
  };

  return (
    <div className="gorblinmodal">
      {state == 'initial' ? (
        <>
          <h1 className="title" style={{ margin: 0, padding: 0 }}>
            the gorblin has a
          </h1>
          <h1 className="title" style={{ margin: 0, marginBottom: '1rem' }}>
            deal for you
          </h1>
          <img
            src="/graphics/gorblin.png"
            width="100"
            height="100"
            className="tile-image"
            style={{ position: 'relative', top: '-1rem' }}
          />
          <h1 className="title" style={{ color: '#B6D17D' }}>
            if you let me in, it'll be super chill trust me ;)
          </h1>
          <div className="meta">
            <div className="spacer"></div>
            {/* TODO change the URL and what to do after the modal is closed? */}
            <a
              // href={`${OPENSEA_URL}${EXQUISITE_LAND_CONTRACT_ADDRESS}/${generateTokenID(
              //   x,
              //   y
              // )}`}
              onClick={() => {
                setState('sign');
              }}
              className="button"
              style={{ background: '#7CC45D', marginTop: '1.5rem' }}
              target="_blank"
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}
              >
                {/* <img
                  src="/graphics/gorblin.png"
                  style={{
                    imageRendering: 'pixelated',
                    width: '3rem',
                    height: '3rem'
                  }}
                />{' '} */}
                <h3 style={{ margin: 0 }}>agree to let the gorblin in</h3>
              </div>
            </a>
            {/* <a>
              <h2>uhh, i'm not so sure</h2>
            </a> */}
            <div className="spacer"></div>
          </div>
        </>
      ) : state == 'sign' ? (
        <div>
          <h1 className="gorblin">
            you sure, bud? the stuarts are gonna hate this. i’m about to get
            real weird
          </h1>
          <img
            src="/graphics/gorblin.png"
            width="100"
            height="100"
            className="tile-image"
          />
          <a
            onClick={() => {
              signAndInviteGorblin();
            }}
            className="button"
            style={{ background: '#7CC45D', marginTop: '1.5rem' }}
            target="_blank"
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}
            >
              {/* <img
                  src="/graphics/gorblin.png"
                  style={{
                    imageRendering: 'pixelated',
                    width: '3rem',
                    height: '3rem'
                  }}
                />{' '} */}
              <h3 style={{ margin: 0 }}>sign to let the gorblin in</h3>
            </div>
          </a>
          <a
            onClick={() => {
              setState('initial');
            }}
            // className="button"
            // style={{ background: '#7CC45D', marginTop: '1.5rem' }}
            target="_blank"
          >
            <h3 className="pantheon" style={{ margin: 0 }}>
              uhhh, i'm not so sure
            </h3>
          </a>
        </div>
      ) : (
        <div>
          <h1 className="pantheon">gorblin inbound: 23:00:24</h1>
          <img
            src="/graphics/gorblin.png"
            width="100"
            height="100"
            className="tile-image"
          />
          <h1 className="gorblin">lfg! i'm gonna coin the communal ass</h1>
        </div>
      )}
      <style jsx>{`
        .gorblin {
          color: #b6d17d;
        }
        .pantheon {
          color: #fff;
        }
        .tile-modal {
          width: min(90vw, 500px);
        }
        .title {
          padding-bottom: 0.75rem;
          text-align: center;
          color: #fff;
          padding: 8px 0;
          text-decoration: none;
        }
        .title:hover {
          text-decoration: underline;
        }
        .title:hover::after {
          content: ' 🔗';
          position: absolute;
          margin-left: 0.5rem;
        }
        .tile-image {
          width: 100%;
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

        a.button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #ddd;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
          text-decoration: none;
        }
        a.button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }
        a.button img {
          width: 16px;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default GorblinModal;
