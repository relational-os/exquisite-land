import CachedENSName from '@app/components/CachedENSName';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState, useEffect } from 'react';

const GorblinTools = () => {
  const [text, setText] = React.useState('');

  const { account, connect, provider } = useWallet();
  const [isLinked, setLinked] = useState(false);
  const [error, setError] = useState<string>();
  const [signature, setSignature] = useState<string>();
  const [tileData, setTileData] = useState<any>();
  const [discordMessageId, setDiscordMessageId] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();

  useEffect(() => {
    fetch('/api/gorblin/admin-start').then((response) =>
      response.json().then((data) => {
        console.log({ data });
        setTileData(data);
      })
    );
  }, []);

  const signMessage = async () => {
    if (!provider || !account) return;
    const signature = await provider.getSigner().signMessage('I am me.');
    const { error, success } = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signature, account })
    }).then((res) => res.json());
    if (error) setError(error);
    if (success) {
      setLinked(true);
      setSignature(signature);
    }
  };

  function initiateGorblin() {
    console.log('initiating gorblin!');
    fetch('/api/gorblin/admin-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, signature })
    }).then((res) => res.json());
  }

  function concludeGorblin() {
    console.log('concluding gorblin!');
    fetch('/api/gorblin/admin-end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account,
        signature,
        discordMessageId: discordMessageId,
        tokenId: tokenId
      })
    }).then((res) => res.json());
  }

  function sendWebhookRequest() {
    console.log('sendWebhookMessage', text);

    const response = fetch(`/api/bot/send-message`, {
      method: 'POST',
      body: JSON.stringify({
        content: text,
        channel: 'terra-masu',
        as: 'gorblin',
        signature: signature,
        account: account
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json());

    setText('');
    console.log({ response });
  }

  return (
    <div className="body">
      <div className="auth section">
        {isLinked ? (
          <>
            <CachedENSName address={account} /> linked!
          </>
        ) : error ? (
          <div className="error">{error}</div>
        ) : account ? (
          <>
            <CachedENSName address={account} />
            <button onClick={signMessage}>Sign message</button>
          </>
        ) : (
          <button onClick={() => connect()}>Connect Wallet</button>
        )}
      </div>

      <div className="message-send section">
        <h2>Send message as Gorblin</h2>
        <span className="description">
          will send to Exquisite Land : #bot-testing
        </span>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
        ></input>

        <button className="sendButton" onClick={sendWebhookRequest}>
          send
        </button>
      </div>

      <div className="admin-start section">
        <h2>Admin start</h2>

        <pre className="json">{JSON.stringify(tileData, null, 2)}</pre>

        <button onClick={initiateGorblin}>Announce giveaway</button>
      </div>

      <div className="admin-end section col">
        <h2>Admin end</h2>

        <span>Gorblin giveaway message ID</span>
        <input
          placeholder="message id"
          value={discordMessageId}
          onChange={(event) => setDiscordMessageId(event.target.value)}
        ></input>
        <input
          placeholder="token id"
          value={tokenId}
          onChange={(event) => setTokenId(event.target.value)}
        ></input>
        <button onClick={concludeGorblin}>Conclude giveaway</button>
      </div>

      <style jsx>{`
        .body {
          color: white;
          padding: 4rem;
        }

        .col {
          display: flex;
          width: 350px;
          flex-direction: column;
        }

        .section {
          padding-bottom: 2rem;
        }

        .message-send {
          display: flex;
          width: 350px;
          flex-direction: column;
        }

        .sendButton {
          margin-top: 0.3rem;
          width: 50px;
        }

        .description {
          color: gray;
          font-size: 0.8rem;
        }

        .json {
          padding: 0.8rem;
          background: darkgray;
        }
      `}</style>
    </div>
  );
};

export default GorblinTools;
