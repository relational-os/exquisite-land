import CachedENSName from '@app/components/CachedENSName';
import { useWallet } from '@gimmixorg/use-wallet';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const GorblinTools = () => {
  const [text, setText] = React.useState('');

  const { account, connect, provider } = useWallet();
  const [isLinked, setLinked] = useState(false);
  const [error, setError] = useState<string>();
  const [signature, setSignature] = useState<string>();
  const [giveaways, setGiveaways] = useState<any>();
  const [channel, setChannel] = useState<string>('');
  const [bot, setBot] = useState<string>('');
  const [coinImage, setCoinImage] = useState<string>('');
  const [winner, setWinner] = useState<{
    discord: string;
    address: string;
    id: string;
  }>({ discord: '', address: '', id: '' });
  const [lastResponse, setLastResponse] = useState<any>();

  const [responses, setResponses] = useState<any>();
  const [addresses, setAddresses] = useState<any>();

  function refreshGiveaways() {
    fetch('/api/gorblin/giveaway').then((response) =>
      response.json().then((data) => {
        setGiveaways(data.giveaways);
        console.log({ data });
      })
    );
  }

  useEffect(() => {
    refreshGiveaways();
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

  async function recirculateTile(tokenId: string) {
    // create a new giveaway object
    const response = await fetch('/api/gorblin/recirculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, signature, tokenId })
    });
    const responseJson = await response.json();
    setLastResponse(responseJson);
    refreshGiveaways();
  }

  async function hideGiveaway(giveawayId: string) {
    const response = await fetch('/api/gorblin/conclude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, signature, giveawayId })
    });
    const responseJson = await response.json();
    setLastResponse(responseJson);
    refreshGiveaways();
  }

  async function selectWinner(tokenId: Number) {
    console.log('selecting winner!');
    const response = await fetch('/api/gorblin/admin-end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account,
        signature,
        tokenId
      })
    });
    const responseJson = await response.json();
    setLastResponse(responseJson);
    setWinner(responseJson.winnerLookup);
    setAddresses(responseJson.addresses);
    setResponses(responseJson.reactions);
    refreshGiveaways();
  }

  async function setMessageId(tileId: any) {
    const userInput = prompt('enter Dicsord message ID for tile');

    if (userInput && giveaways) {
      console.log('hi');
      const response = await fetch('/api/gorblin/setDiscordMessageId', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tokenId: parseInt(tileId),
          discordMessageId: userInput.trim(),
          signature: signature,
          account: account
        })
      });
      const responseJson = await response.json();
      setLastResponse(responseJson);
      console.log({ responseJson });

      // update tileData
      refreshGiveaways();
    }
  }

  async function announce(x: number, y: number) {
    const response = await fetch(`/api/bot/send-message`, {
      method: 'POST',
      body: JSON.stringify({
        content: `i've claimed [${x},${y}]! if yer landless, place your mark 🟢 and your ass i may coin`,
        channel: 'bot-testing',
        as: 'gorblin',
        signature: signature,
        account: account
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseJson = await response.json();
    setLastResponse(responseJson);
    console.log({ responseJson });
  }

  async function generateCoin(tokenId: string) {
    const response = await fetch('/api/gorblin/generate-coin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account,
        signature,
        tokenId
      })
    });
    const responseJson = await response.json();
    setCoinImage(responseJson.coinImage);
  }

  async function announceWinner(x: number, y: number) {
    // TODO: get discord username, cors issue?
    const discordId = winner['id'] as string;
    const response = await fetch(`/api/bot/send-message`, {
      method: 'POST',
      body: JSON.stringify({
        content: `<@${discordId}> gets me coin! you've 24 hours to draw [${x}, ${y}] or i'll be having it back`,
        channel: 'bot-testing',
        as: 'gorblin',
        signature: signature,
        account: account
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseJson = await response.json();
    console.log({ responseJson });
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

          <div className="admin-end section">
            <h2>Giveaway Details</h2>
            <span>Generated coin</span>
            {coinImage && (
              <div>
                <img
                  className={'image'}
                  src={`data:image/png;base64,${coinImage}`}
                />
              </div>
            )}

            <div className="section small">
              <span>Discord Reactions (unfiltered)</span>
              <pre className="json">{JSON.stringify(responses, null, 2)}</pre>
            </div>

            <div className="section small">
              <span>Reaction Addresses (filtered)</span>
              <pre className="json">{JSON.stringify(addresses, null, 2)}</pre>
            </div>

            {winner && (
              <div className="section small">
                <span>winner</span>
                <pre className="json">{JSON.stringify(winner, null, 2)}</pre>
              </div>
            )}

            {lastResponse && (
              <div className="section small">
                <span>Last Response from Server</span>
                <pre className="json scroll">
                  {JSON.stringify(lastResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div>
            <h2>Giveaways</h2>
            <table className="table">
              <thead>
                <td>Tile</td>
                <td>recirculated</td>
                <td>winner</td>
                <td>message id</td>
                <td>controls</td>
              </thead>
              <tbody>
                {giveaways &&
                  giveaways.map((giveaway: any) => {
                    return (
                      <tr>
                        <td>
                          {giveaway.tokenId} ({giveaway.x},{giveaway.y})
                        </td>
                        <td>{giveaway.recirculated.toString()}</td>
                        <td>{giveaway.winner}</td>
                        <td>{giveaway.discordMessageId}</td>
                        <td>
                          <div>
                            <button
                              hidden={giveaway.recirculated}
                              onClick={(e) => recirculateTile(giveaway.tokenId)}
                            >
                              1. recirculate
                            </button>
                            <button
                              hidden={
                                !giveaway.recirculated ||
                                giveaway.discordMessageId
                              }
                              onClick={(e) => announce(giveaway.x, giveaway.y)}
                            >
                              2. announce giveaway
                            </button>
                          </div>
                          <div>
                            <button
                              hidden={!giveaway.recirculated}
                              onClick={(e) => setMessageId(giveaway.tokenId)}
                            >
                              3. set message ID
                            </button>
                            <button
                              hidden={
                                // !giveaway.recirculated && giveaway.discordMessageId
                                !giveaway.discordMessageId
                              }
                              onClick={(e) => selectWinner(giveaway.tokenId)}
                            >
                              4. choose winner
                            </button>
                          </div>
                          <button
                            hidden={!giveaway.winner || !giveaway.recirculated}
                            onClick={(e) => generateCoin(giveaway.tokenId)}
                          >
                            5. get coin
                          </button>
                          <button
                            hidden={!giveaway.winner || !winner}
                            onClick={(e) =>
                              announceWinner(giveaway.x, giveaway.y)
                            }
                          >
                            6. announce
                          </button>
                          <button
                            hidden={
                              !giveaway.winner || !giveaway.discordMessageId
                            }
                            onClick={(e) => hideGiveaway(giveaway.id)}
                          >
                            7. hide
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        .table {
          width: 100%;
        }
        .button {
        }

        .small {
          font-size: 0.7rem;
        }

        .image {
          width: 250px;
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
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
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

        .scroll {
          max-height: 100px;
          overflow: scroll;
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
