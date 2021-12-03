import React from 'react';
import { useWallet } from '@gimmixorg/use-wallet';
import router, { useRouter } from 'next/router';
import useSWR from 'swr';
import ConnectWalletButton from '@app/components/ConnectWalletButton';
import { ButtonSuccess } from '@app/components/Button';

const discordBotServerUrl = process.env.NEXT_PUBLIC_DISCORD_BOT_SERVER_URL;
if (!discordBotServerUrl) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_DISCORD_BOT_SERVER_URL'
  );
}

// TODO: import this type from our discord package
type User = {
  id: string;
  discordId: string;
  discordUsername: string;
  discordDiscriminator: string;
  discordAvatar: string;
};

const fetcher = (url: string) =>
  fetch(`${discordBotServerUrl}${url}`).then((res) => res.json());

const queryValues = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) {
    return param;
  }
  if (typeof param === 'string') {
    return [param];
  }
  return [];
};

type DiscordUserData = {
  user: User;
  linkAddressMessage: string;
};

const useDiscordUser = ():
  | { data: DiscordUserData; error: null; pending: false }
  | { data: null; error: Error; pending: false }
  | { data: null; error: null; pending: true } => {
  const router = useRouter();
  const id = queryValues(router.query.id)[0];

  const { data, error, isValidating } = useSWR<DiscordUserData>(
    id ? `/api/user?${new URLSearchParams({ id }).toString()}` : null,
    fetcher
  );

  if (data) {
    return { data, error: null, pending: false };
  }

  if (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(error.toString()),
      pending: false
    };
  }

  if (isValidating) {
    return { data: null, error: null, pending: true };
  }

  return {
    data: null,
    error: new Error(
      // TODO: clarify where in Discord to get the right link
      'No verification ID found. Try clicking from the Discord channel.'
    ),
    pending: false
  };
};

const DiscordLinkDialogContents = () => {
  const { account, provider } = useWallet();
  const { data, error, pending } = useDiscordUser();

  if (pending) {
    return <>Loading…</>;
  }
  if (error) {
    return <>Error: {error.message}</>;
  }
  if (!data) {
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
        <img src={data.user.discordAvatar} style={{ borderRadius: '50%' }} />
        {data.user.discordUsername}#{data.user.discordDiscriminator}
      </div>
      {account && provider ? (
        <ButtonSuccess
          onClick={async (event) => {
            // TODO: pending state instead of this hack
            event.currentTarget.disabled = true;

            const message = data.linkAddressMessage;
            const signature = await provider.getSigner().signMessage(message);

            const result = await fetch(`${discordBotServerUrl}/api/link`, {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                account,
                message,
                signature
              })
            }).then((res) => res.json());

            if (result.success) {
              router.push('/');
            }
          }}
        >
          sign message to verify
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
