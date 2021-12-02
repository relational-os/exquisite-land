import { useWallet } from '@gimmixorg/use-wallet';
import React from 'react';

const GorblinTools = () => {
  const { account } = useWallet();

  const [text, setText] = React.useState('');

  function sendWebhookRequest() {
    console.log('sendWebhookMessage', text);

    const response = fetch('/api/message', {
      method: 'POST',
      body: JSON.stringify({ content: text }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json());

    setText('');
    console.log({ response });
  }

  // TODO: add authentication
  return (
    <div className="">
      <div className="message-send">
        <span>Send message as Gorblin</span>
        <span className="description">
          will send to Relational Discord : #bot-testing
        </span>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
        ></input>

        <button className="sendButton" onClick={sendWebhookRequest}>
          send
        </button>
      </div>

      <style jsx>{`
        .message-send {
          padding: 2rem;
          width: 350px;
          display: flex;
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
      `}</style>
    </div>
  );
};

export default GorblinTools;
