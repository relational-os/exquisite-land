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
        <ENSName
          address={account}
          displayType={AddressDisplayEnum.FIRST4_LAST4}
          withEllipses={true}
        ></ENSName>
      ) : (
        <button
          className="connectwalletbutton"
          onClick={() => connect({ providerOptions: providerOptions })}
        >
          Connect Wallet
        </button>
      )}
      <style jsx>{`
        .connectwalletbutton {
        }
      `}</style>
    </div>
  );
};

export default ConnectWalletButton;
