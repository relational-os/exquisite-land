import React, { useEffect, useState } from 'react';

const DiscordMessagesModal = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/discord/terra-masu/messages')
      .then((res) => res.json())
      .then((d) => setMessages(d));
  }, []);

  return (
    <div className="transaction-history-modal">
      {messages.map((m) => {
        return (
          <div className="message">
            <img
              src={`https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.png`}
            />
            <div>{m.author.username}</div>
            <div>{m.content}</div>
            <div>{m.timestamp}</div>
          </div>
        );
      })}
      <style jsx>{`
        .discord-messages-modal {
        }
        .message {
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default DiscordMessagesModal;
