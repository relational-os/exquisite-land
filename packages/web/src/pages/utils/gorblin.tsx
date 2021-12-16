import CachedENSName from '@app/components/CachedENSName';
import { DISCORD_CHANNELS, EMOJI_CODES } from '@app/features/AddressBook';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const GorblinTools = () => {
  const [text, setText] = React.useState('');

  const { account, connect, provider } = useWallet();
  const [isLinked, setLinked] = useState(false);
  const [error, setError] = useState<string>();
  const [signature, setSignature] = useState<string>();
  const [tileData, setTileData] = useState<any>();
  const [discordMessageId, setDiscordMessageId] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();
  const [channel, setChannel] = useState<string>('');
  const [bot, setBot] = useState<string>('');
  const [coinImage, setCoinImage] = useState<string>('');
  const [winner, setWinner] = useState<string>('');
  const [discordWinner, setDiscordWinner] = useState<string>('');

  const [responses, setResponses] = useState<any>();
  const [addresses, setAddresses] = useState<any>();

  useEffect(() => {
    fetch('/api/gorblin/admin-start').then((response) =>
      response.json().then((data) => {
        console.log({ data });
        setTileData(data);
      })
    );
  }, []);

  function getResponses() {
    fetch(
      `${process.env.NEXT_PUBLIC_DISCORD_BOT_SERVER_URL}/api/reactions?channelId=${DISCORD_CHANNELS['terra-masu']}&messageId=${discordMessageId}&emoji=${EMOJI_CODES[':green_circle:']}`
    ).then((response) => {
      response.json().then((data) => {
        console.log({ data });
        setResponses(data.reactions);
        setAddresses(data.addresses);
      });
    });
  }

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

  async function concludeGorblin() {
    console.log('concluding gorblin!');
    const response = await fetch('/api/gorblin/admin-end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account,
        signature,
        discordMessageId: discordMessageId,
        tokenId: tokenId
      })
    });
    const responseJson = await response.json();
    setCoinImage(responseJson.coinImage);
    setWinner(responseJson.winner);
    setAddresses(responseJson.addresses);
    setResponses(responseJson.reactions);
    fetch(
      `${
        process.env.NEXT_PUBLIC_DISCORD_BOT_SERVER_URL
      }/api/lookup?address=${winner.toLowerCase()}`
    ).then((response) =>
      response.json().then((data) => {
        console.log({ data });
        setDiscordWinner(data.discord);
      })
    );
  }

  function sendWebhookRequest() {
    console.log('sendWebhookMessage', text);

    const response = fetch(`/api/bot/send-message`, {
      method: 'POST',
      body: JSON.stringify({
        content: text,
        channel: channel,
        as: bot,
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
            <button onClick={signMessage}>Sign In</button>
          </>
        ) : (
          <button onClick={() => connect()}>Connect Wallet</button>
        )}
      </div>

      {signature && (
        <div>
          <div className="message-send section">
            <h2>Send message as Gorblin</h2>
            <span className="description">type your messsage here</span>
            <input
              value={text}
              className="select"
              onChange={(event) => setText(event.target.value)}
            ></input>

            <span className="description">
              select the bot you would like to send with
            </span>
            <Select
              options={[
                { value: 'gorblin', label: 'gorblin' },
                { value: 'xqst', label: 'xqst' }
              ]}
              onChange={(selected) => {
                console.log({ selected });
                if (selected) {
                  setBot(selected.value);
                }
              }}
            />

            <span className="description">
              select the channel you'd like to send to
            </span>
            <Select
              options={[
                { value: 'landless', label: 'landless' },
                { value: 'bot-testing', label: 'bot-testing' },
                { value: 'terra-masu', label: 'terra-masu' }
              ]}
              onChange={(selected) => {
                if (selected) {
                  setChannel(selected.value);
                }
              }}
            />

            <button
              disabled={!channel || !bot || !text}
              className="sendButton"
              onClick={sendWebhookRequest}
            >
              send
            </button>
          </div>

          <div className="admin-start section">
            <h2>Giveaway Start Controls</h2>

            <pre className="json">{JSON.stringify(tileData, null, 2)}</pre>

            <button onClick={initiateGorblin}>Recirculate Tile</button>
          </div>

          <div className="admin-end section">
            <h2>Giveaway End Controls</h2>

            <div className="col">
              <span>message ID from Discord</span>
              <input
                placeholder="message id"
                value={discordMessageId}
                onChange={(event) => setDiscordMessageId(event.target.value)}
              ></input>
              <span>tile token ID</span>
              <input
                placeholder="token id"
                value={tokenId}
                onChange={(event) => setTokenId(event.target.value)}
              ></input>
            </div>

            <div className="section">
              <span>Discord Reactions (unfiltered)</span>
              <pre className="json">{JSON.stringify(responses, null, 2)}</pre>
            </div>

            <div className="section">
              <span>Reaction Addresses (filtered)</span>
              <pre className="json">{JSON.stringify(addresses, null, 2)}</pre>
            </div>

            <div className="section">
              <span>winner</span>
              <pre className="json">{winner}</pre>
              <pre className="json">{discordWinner}</pre>
            </div>

            <div className="col">
              <button
                disabled={!discordMessageId}
                className="button"
                onClick={getResponses}
              >
                Preview Responses
              </button>

              <button
                disabled={!discordMessageId || !tokenId}
                className="button"
                onClick={concludeGorblin}
              >
                Generate Coin
              </button>
              {coinImage && <img src={`data:image/png;base64,${coinImage}`} />}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .button {
        }

        .select {
          color: #000;
        }

        .body {
          color: gray;
          padding: 4rem;
        }

        .col {
          display: flex;
          width: 350px;
          flex-direction: column;
        }

        .section {
          padding-top: 1rem;
          padding-bottom: 1rem;
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
          color: black;
          padding: 0.8rem;
          padding-top: 0;
          background: darkgray;
        }
      `}</style>
    </div>
  );
};

export default GorblinTools;
