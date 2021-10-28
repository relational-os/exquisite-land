import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const DiscordMessagesModal = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/discord/terra-masu/messages')
      .then((res) => res.json())
      .then((d) => setMessages(d));
  }, []);

  return (
    <div className="discord-messages-modal">
      {messages.map((m) => {
        return (
          <div className="message" key={m.id}>
            <img
              height="32px"
              width="32px"
              className="avatar"
              src={
                m.author.avatar
                  ? `https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.png`
                  : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D' // empty inline png
              }
            />

            <div className="body">
              <div className="message-header">
                {m.author.username}{' '}
                <span>{dayjs(m.timestamp).format('MMM d, h:mma')}</span>
              </div>

              <div className="message-content">{m.content}</div>
            </div>
          </div>
        );
      })}
      <style jsx>{`
        .discord-messages-modal {
          padding: 1rem;
          font-size: 1.25rem;
          color: #fff;
        }
        .message {
          display: flex;
          margin-bottom: 1rem;
          flex-direction: row;
          gap: 1rem;
        }

        .avatar {
          align-self: flex-start;
          background-color: gold;
          border-radius: 50%;
          image-rendering: pixelated;
        }

        .message .message-header {
          color: #1abc9c;
          margin-bottom: 0.2rem;
        }

        .message .message-header span {
          font-size: 0.75rem;
          opacity: 0.5;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default DiscordMessagesModal;
