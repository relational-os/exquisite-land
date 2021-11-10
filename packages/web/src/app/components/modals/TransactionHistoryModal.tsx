import useTransactionsStore, {
  LocalTransactionState
} from '@app/features/useTransactionsStore';
import React from 'react';
import dayjs from 'dayjs';
import { getSVGFromPixels } from '@app/features/TileUtils';

const TransactionHistoryModal = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  return (
    <div className="activity">
      <div className="controls">
        <button onClick={() => useTransactionsStore.getState().clearAll()}>
          Clear all
        </button>
      </div>
      {transactions.map((transaction) => (
        <TransactionHistoryItem
          key={transaction.hash}
          transaction={transaction}
        />
      ))}

      <style jsx>{`
        .activity {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          font-size: 1.25rem;
          color: #fff;
        }
        .controls {
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

const TransactionHistoryItem = ({
  transaction
}: {
  transaction: LocalTransactionState;
}) => {
  return (
    <div className="transaction-item">
      <div className="meta">
        <div className="title">{transaction.title}</div>
        <div className="info">
          <a
            href={`https://mumbai.polygonscan.com/tx/${transaction.hash}`}
            target="_blank"
          >
            {transaction.hash.slice(0, 6)}...{transaction.hash.slice(-4)}:{' '}
            {transaction.status}
          </a>
        </div>
        <div className="date">
          {dayjs(transaction.date).format('MMM D, h:mma')}
        </div>
      </div>
      {transaction.pixels && (
        <svg
          dangerouslySetInnerHTML={{
            __html: getSVGFromPixels(transaction.pixels)
          }}
        />
      )}
      <style jsx>{`
        .transaction-item {
          margin: 0 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
        }
        a {
          color: inherit;
        }

        .title {
          font-size: 18px;
          margin-bottom: 5px;
        }
        .info {
          margin-bottom: 5px;
        }
        .date {
          color: #999;
        }
        svg {
          width: 100px;
          height: 100px;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default TransactionHistoryModal;
