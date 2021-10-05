import { User } from '@prisma/client';
import prisma from '@server/helpers/prisma';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { useWallet } from '@gimmixorg/use-wallet';
import { ENSName } from 'ethereum-ens-name';
import { ethJsonRpcProvider } from '@app/features/getJsonRpcProvider';

export const SIGNING_MESSAGE = 'ALL HAIL KING SEAWORM';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await prisma.user.findUnique({
    where: { id: ctx.query.id as string },
    select: {
      id: true,
      discordId: true,
      discordUsername: true,
      discordDiscriminator: true,
      discordAvatar: true,
      address: true
    }
  });
  if (!user) return { redirect: { destination: '/404', permanent: false } };
  return { props: { user } };
};

const LinkWallet = ({
  user
}: {
  user: Pick<
    User,
    | 'id'
    | 'discordId'
    | 'discordUsername'
    | 'discordDiscriminator'
    | 'discordAvatar'
    | 'address'
  >;
}) => {
  const { account, connect, provider } = useWallet();
  const [isLinked, setLinked] = useState(false);
  const [error, setError] = useState<string>();
  const signMessage = async () => {
    if (!provider || !account) return;
    const signature = await provider.getSigner().signMessage(SIGNING_MESSAGE);
    const { error, success } = await fetch('/api/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signature, account, id: user.id })
    }).then((res) => res.json());
    if (error) setError(error);
    if (success) setLinked(true);
  };

  return (
    <div className="link-wallet">
      <img src={user.discordAvatar} className="avatar" width="80" height="80" />
      <div className="message">
        {user.discordUsername}#{user.discordDiscriminator}
      </div>
      {isLinked ? (
        <>
          <ENSName address={account} provider={ethJsonRpcProvider} /> linked!
        </>
      ) : error ? (
        <div className="error">{error}</div>
      ) : account ? (
        <>
          <ENSName address={account} provider={ethJsonRpcProvider} />
          <button onClick={signMessage}>Sign message</button>
        </>
      ) : (
        <button onClick={() => connect()}>Connect Wallet</button>
      )}
      <style jsx>{`
        .link-wallet {
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        .avatar {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default LinkWallet;
