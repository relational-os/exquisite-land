import React from 'react';
import { useWallet } from '@gimmixorg/use-wallet';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ConnectWalletButton from '@app/components/ConnectWalletButton';
import { ButtonSuccess } from '@app/components/Button';

// TODO: import this type from our discord package
type User = {
  id: string;
  discordId: string;
  discordUsername: string;
  discordDiscriminator: string;
  discordAvatar: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const queryValues = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) {
    return param;
  }
  if (typeof param === 'string') {
    return [param];
  }
  return [];
};

const useDiscordUser = ():
  | { user: User; error: null; pending: false }
  | { user: null; error: Error; pending: false }
  | { user: null; error: null; pending: true } => {
  const router = useRouter();
  const id = queryValues(router.query.id)[0];

  const { data, error, isValidating } = useSWR<{ user: User }>(
    id ? `/api/discord/user?${new URLSearchParams({ id }).toString()}` : null,
    fetcher
  );

  return {
    user: {
      id: '1234',
      discordId: '1234',
      discordUsername: 'holic',
      discordDiscriminator: '4944',
      discordAvatar:
        'https://cdn.discordapp.com/avatars/79416844720537600/2342b5c3d3b59e4ab7e8dd700abd47a1.webp'
    },
    error: null,
    pending: false
  };

  if (data?.user) {
    return { user: data.user, error: null, pending: false };
  }

  if (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error(error.toString()),
      pending: false
    };
  }

  if (isValidating) {
    return { user: null, error: null, pending: true };
  }

  return {
    user: null,
    error: new Error(
      // TODO: clarify where in Discord to get the right link
      'No verification ID found. Try clicking from the Discord channel.'
    ),
    pending: false
  };
};

const DiscordLinkDialogContents = () => {
  const { account, provider } = useWallet();
  const { user, error, pending } = useDiscordUser();

  if (pending) {
    return <>Loading…</>;
  }
  if (error) {
    return <>Error: {error.message}</>;
  }
  if (!user) {
    // Shouldn't be able to get here, but not sure how to get the TS "or" to work
    throw new Error('Something broke');
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5em',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img src={user.discordAvatar} style={{ borderRadius: '50%' }} />
        {user.discordUsername}#{user.discordDiscriminator}
      </div>
      {account && provider ? (
        <ButtonSuccess
          onClick={async () => {
            // TODO: add some server-sent nonce or hash so this can't be altered
            const message = `ALL HAIL KING SEAWORM\n\n\n${user.id}`;
            const signature = await provider.getSigner().signMessage(message);

            const res = await fetch('/api/link', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                account,
                message,
                signature,
                id: user.id
              })
            });

            // TODO: redirect or show some success message
          }}
        >
          Sign message to verify
        </ButtonSuccess>
      ) : (
        <ConnectWalletButton />
      )}
    </>
  );
};

const DiscordLinkPage = () => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <div
      style={{
        padding: '3em',
        width: '30rem',
        background: 'rgba(0, 0, 0, 0.2)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        fontSize: '1.5rem'
      }}
    >
      <DiscordLinkDialogContents />
    </div>
  </div>
);

export default DiscordLinkPage;
