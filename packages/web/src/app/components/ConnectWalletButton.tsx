import React from "react";

import { useWallet } from "@gimmixorg/use-wallet";
import { ENSName, AddressDisplayEnum } from "react-ens-name";
import WalletConnectProvider from "@walletconnect/web3-provider";

const ConnectWalletButton = () => {
  const { connect, account } = useWallet();

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY as string,
      },
    },
  };

  return (
    <div>
      {account ? (
        <div className="account">
          <ENSName
            address={account}
            displayType={AddressDisplayEnum.FIRST4_LAST4}
            withEllipses={true}
          />
        </div>
      ) : (
        <button
          className="connect-wallet-button"
          onClick={() =>
            connect({ cacheProvider: true, providerOptions: providerOptions })
          }
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
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }
        .connect-wallet-button:hover {
          box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
        }
        .account {
          font-size: 24px;
        }
      `}</style>
    </div>
  );
};

export default ConnectWalletButton;
