import React, { useEffect, useRef, useState } from "react";

interface WalletSuffleLoadingProps {
  wallets: string[];
  selectedWallet?: string;
  loading?: boolean;
}

/*
  Visually loops through an array of wallet addresses until either loading = true or selectedWallet is truthy.
*/
const WalletSuffleLoading = (props: WalletSuffleLoadingProps) => {
  const { wallets, selectedWallet, loading } = props;

  const intervalRef = useRef<NodeJS.Timer | undefined>();
  const [walletIndex, setWalletIndex] = useState(0);
  const [previousWalletIndex, setPreviousWalletIndex] = useState(1);

  useEffect(() => {
    if (!wallets?.length) return;
    intervalRef.current = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * wallets?.length);
      // Dumb but works
      while (randomIndex === previousWalletIndex) {
        randomIndex = Math.floor(Math.random() * wallets?.length);
      }
      setWalletIndex((prevWalletIndex) => {
        setPreviousWalletIndex(prevWalletIndex);
        return randomIndex;
      });
    }, 125);

    return () => clearInterval(intervalRef.current as NodeJS.Timer);
  }, [wallets, previousWalletIndex]);

  useEffect(() => {
    if ((!loading || selectedWallet) && intervalRef.current) {
      clearInterval(intervalRef.current as NodeJS.Timer);
    }
  }, [loading, selectedWallet]);

  return <span>{selectedWallet || wallets?.[walletIndex]}</span>;
};

export default React.memo(
  WalletSuffleLoading,
  (prevProps, nextProps) =>
    prevProps.selectedWallet !== nextProps.selectedWallet &&
    prevProps.loading !== nextProps.loading &&
    JSON.stringify(prevProps.wallets) !== JSON.stringify(nextProps.wallets)
);
