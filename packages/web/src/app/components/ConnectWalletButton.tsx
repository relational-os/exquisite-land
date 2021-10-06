import React, { useEffect, useCallback } from 'react';

import { useWallet } from '@gimmixorg/use-wallet';
import { ENSName, AddressDisplayEnum } from 'react-ens-name';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethJsonRpcProvider } from '@app/features/getJsonRpcProvider';

const ConnectWalletButton = () => {
  const { connect, account } = useWallet();

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY as string
      }
    }
  };

  const connectWallet = useCallback(() => {
    connect({
      cacheProvider: true,
      providerOptions: providerOptions,
      theme: 'dark'
    });
  }, []);

  // try an initial connect, we might be cached
  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <div className="account-container">
      {account ? (
        <div className="account">
          <ENSName
            address={account}
            displayType={AddressDisplayEnum.FIRST4_LAST4}
            withEllipses={true}
            provider={ethJsonRpcProvider}
          />
        </div>
      ) : (
        <button
          className="connect-wallet-button"
          onClick={() => connectWallet()}
        >
          connect wallet
        </button>
      )}
      <style jsx>{`
        .connect-wallet-button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #eee;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
          min-width: 170px;
        }
        .connect-wallet-button:hover {
          box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
        }
        .account {
          font-size: 24px;
          color: white;
          display: flex;
          justify-content: center;
          min-width: 170px;
        }
        .wrong-network {
          font-size: 24px;
          color: red;
        }
      `}</style>
    </div>
  );
};

export default ConnectWalletButton;
