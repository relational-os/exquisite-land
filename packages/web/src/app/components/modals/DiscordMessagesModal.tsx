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
          <div className="message">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>{m.author.username}</div>
              <img
                height="64px"
                width="64px"
                className="avatar"
                src={
                  m.author.avatar
                    ? `https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.png`
                    : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D' // empty inline png
                }
              />
              <div>{dayjs(m.timestamp).format('MMM d, h:mma')}</div>
            </div>
            <div>{m.content}</div>
          </div>
        );
      })}
      <style jsx>{`
        .discord-messages-modal {
          font-size: 1.25rem;
          color: white;
        }
        .message {
          display: flex;
          align-items: center;
          padding-bottom: 1rem;
        }
        .avatar {
          background-color: gold;
        }
      `}</style>
    </div>
  );
};

export default DiscordMessagesModal;
