import { useWallet } from '@gimmixorg/use-wallet';
import React from 'react';
import Button from '../Button';

const ConnectWalletModal = () => {
  const { connect } = useWallet();

  return (
    <div className="connectwalletmodal">
      <Button onClick={() => connect()}>Connect Wallet</Button>
      <style jsx>{`
        .connectwalletmodal {
          width: 400px;
          text-align: center;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ConnectWalletModal;
