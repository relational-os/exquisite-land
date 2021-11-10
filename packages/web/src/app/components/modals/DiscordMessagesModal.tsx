import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const DiscordMessagesModal = ({ isOpen }: { isOpen: boolean }) => {
  const [initialized, setInitialized] = useState(false);

  const { data: messages } = useSWR(
    !initialized || isOpen ? '/api/discord/terra-masu/messages' : null,
    fetcher,
    { refreshInterval: 3 * 1000 }
  );
  useEffect(() => {
    setInitialized(true);
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, isOpen]);
  return (
    <div className="discord-messages-modal">
      {messages?.map((m: any) => {
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
      <div ref={ref} className="bottom" />
      <style jsx>{`
        .discord-messages-modal {
          padding: 1rem;
          font-size: 1.25rem;
          color: #fff;
        }
        .message {
          display: flex;
          margin-bottom: 1.5rem;
          flex-direction: row;
          gap: 1rem;
        }

        .bottom {
          flex: 1 1 auto;
        }
        .avatar {
          align-self: flex-start;

          border-radius: 50%;
          image-rendering: pixelated;
          background: url('/graphics/icon-discord.svg') center center no-repeat;
          background-size: 18px;
          background-color: #7189da;
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
