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
					connect wallet
				</button>
			)}
			<style jsx>{`
				.connectwalletbutton {
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

				.connectwalletbutton:hover {
					box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
				}
			`}</style>
		</div>
	);
};

export default ConnectWalletButton;
