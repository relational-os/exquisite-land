import React from "react";

import { useWallet } from "@gimmixorg/use-wallet";
import { ENSName, AddressDisplayEnum } from "react-ens-name";

const ConnectWalletButton = () => {
  const { connect, account } = useWallet();

  return (
    <div>
      {account ? (
        <ENSName
          address={account}
          displayType={AddressDisplayEnum.FIRST4_LAST4}
          withEllipses={true}
        ></ENSName>
      ) : (
        <button className="connectwalletbutton" onClick={() => connect()}>
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
