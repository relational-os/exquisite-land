import CoinDrop from '@app/components/modals/CoinDropModal';
import CreateSeed from '@app/components/invites/CreateSeed';
import InviteNeighbors from '@app/components/invites/InviteNeighbors';
import { useWallet } from '@gimmixorg/use-wallet';
import React from 'react';

const CoinTools = () => {
  const { account } = useWallet();

  return (
    <div className="coin-tools">
      {account ? (
        <>
          <CreateSeed />
          <InviteNeighbors />
          <CoinDrop />
        </>
      ) : (
        'Connect Wallet to start'
      )}
      <style jsx>{`
        .coin-tools {
          height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 20px;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default CoinTools;
