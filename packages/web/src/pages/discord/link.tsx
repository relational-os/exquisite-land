import React from 'react';
import { useWallet } from '@gimmixorg/use-wallet';
import { useRouter } from 'next/router';
import ConnectWalletButton from '@app/components/ConnectWalletButton';
import { ButtonSuccess } from '@app/components/Button';
import { ENSName, AddressDisplayEnum } from 'react-ens-name';
import { getEthJsonRpcProvider } from '@app/features/getJsonRpcProvider';
import { useAsync, useAsyncFn } from 'react-use';
import Modal from 'react-modal';
import Link from 'next/link';

const discordBotServerUrl = process.env.NEXT_PUBLIC_DISCORD_BOT_SERVER_URL;
if (!discordBotServerUrl) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_DISCORD_BOT_SERVER_URL'
  );
}

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
  // TODO: import this type from our discord package?
  user: {
    id: string;
    discordId: string;
    discordUsername: string;
    discordDiscriminator: string;
    discordAvatar: string;
    address?: string;
  };
  linkAddressMessage: string;
};

const useDiscordUser = () => {
  const router = useRouter();
  const id = queryValues(router.query.id)[0];

  return useAsync(async () => {
    if (!id) return;

    const res = await fetch(
      `${discordBotServerUrl}/api/user?${new URLSearchParams({
        id
      }).toString()}`
    );

    if (!res.ok) {
      throw new Error(
        // TODO: clarify where in Discord to get the right link
        'No verification ID found. Try clicking from the Discord channel.'
      );
    }

    const data: DiscordUserData = await res.json();

    return data;
  }, [id]);
};

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(51, 51, 51, 0.95)',
    backgroundPosition: 'center center',
    backgroundSize: '75%',
    backgroundRepeat: 'no-repeat',
    zIndex: 1112
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: 0,
    padding: 0
  }
};

const DiscordLinkDialogContents = () => {
  const { account, provider } = useWallet();
  const { value, error, loading } = useDiscordUser();
  const router = useRouter();

  const [linkUserState, linkUser] = useAsyncFn(
    (account: string, message: string, signature: string) =>
      fetch(`${discordBotServerUrl}/api/link`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account,
          message,
          signature
        })
      }).then((res) => res.json())
  );

  if (error) {
    return <>Error: {error.message}</>;
  }
  if (loading || !value) {
    return <>Loading…</>;
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
        <img src={value.user.discordAvatar} style={{ borderRadius: '50%' }} />
        <span>
          {value.user.discordUsername}#{value.user.discordDiscriminator}
        </span>
        {value.user.address ? (
          <span style={{ opacity: '0.5' }}>
            linked to{' '}
            <ENSName
              address={value.user.address}
              displayType={AddressDisplayEnum.FIRST4_LAST4}
              withEllipses
              provider={provider || getEthJsonRpcProvider}
            />
          </span>
        ) : null}
      </div>

      {account && provider ? (
        <ButtonSuccess
          disabled={linkUserState.loading}
          onClick={async (event) => {
            const message = value.linkAddressMessage;
            const signature = await provider.getSigner().signMessage(message);

            await linkUser(account, message, signature);
          }}
        >
          {linkUserState.loading ? <>linking…</> : <>sign to link discord</>}
        </ButtonSuccess>
      ) : (
        <ConnectWalletButton />
      )}

      {linkUserState.value && linkUserState.value.success ? (
        <Modal
          isOpen
          style={modalStyles}
          onRequestClose={() => router.push('/')}
        >
          <div onClick={() => router.push('/')}>
            <span>success!</span>
            <Link href="/">
              <a>&larr; head back to the canvas</a>
            </Link>
          </div>
          <style jsx>{`
            div {
              padding: 4rem;
              background: #111;
              color: #fff;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 2rem;
              font-size: 1.5rem;
            }
            a {
              text-decoration: none;
              color: #fc0;
            }
            a:hover {
              text-decoration: underline;
            }
          `}</style>
        </Modal>
      ) : null}
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
        padding: '3rem',
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
