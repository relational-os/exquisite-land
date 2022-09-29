import "@rainbow-me/rainbowkit/styles.css";

import enforceEnvs from "./enforceEnvs";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";

export const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

enforceEnvs();

// todo; clean this up
export const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygonMumbai],
  [
    infuraProvider({apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY})
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Exquisite Land",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export const EthereumProviders: React.FC = ({ children }) => (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
  </WagmiConfig>
);
