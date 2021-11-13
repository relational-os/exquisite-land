import useTransactionsStore, {
  LocalTransactionState
} from '@app/features/useTransactionsStore';
import React from 'react';
import dayjs from 'dayjs';
import { getSVGFromPixels } from '@app/features/TileUtils';
import Button from '../Button';

const TransactionHistoryModal = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  return (
    <div className="activity">
      <div className="controls">
        <Button onClick={() => useTransactionsStore.getState().clearAll()}>
          Clear all
        </Button>
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
          flex-direction: column-reverse;
          justify-content: center;
          align-items: flex-start;
          padding: 1rem 0;
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
      <div className="date">
        {dayjs(transaction.date).format('MMM D, h:mma')}
      </div>
      <div className="title">{transaction.title}</div>
      {transaction.pixels && (
        <svg
          dangerouslySetInnerHTML={{
            __html: getSVGFromPixels(transaction.pixels)
          }}
        />
      )}
      <div className="meta">
        <div className="info">
          {transaction.status == 'pending' && (
            <span className="pending">* </span>
          )}
          {transaction.status == 'confirmed' && (
            <span className="confirmed">* </span>
          )}
          {transaction.status == 'failed' && <span className="failed">* </span>}
          {transaction.status}:{' '}
          <a
            href={`https://polygonscan.com/tx/${transaction.hash}`}
            target="_blank"
          >
            tx
          </a>
        </div>
      </div>

      <style jsx>{`
        .transaction-item {
          width: 100%;
          margin: 0 0 1rem;
          padding: 0 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        a {
          color: inherit;
        }

        .meta {
          flex: 1;
        }

        .title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .info {
          margin-top: 5px;
          text-align: center;
        }
        .date {
          margin-bottom: 5px;
          font-size: 0.9rem;
          opacity: 0.5;
          text-align: center;
        }

        .pending,
        .confirmed,
        .failed {
          vertical-align: middle;
          font-size: 2rem;
          margin-right: -3px;
        }

        .pending {
          color: #ffc107;
        }
        .confirmed {
          color: #28a745;
        }
        .failed {
          color: #dc3545;
        }

        svg {
          width: 200px;
          height: 200px;
          display: block;
          margin-top: 0.2rem;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default TransactionHistoryModal;
