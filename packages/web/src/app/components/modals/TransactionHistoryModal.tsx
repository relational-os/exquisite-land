import useTransactionsStore, {
  LocalTransactionState
} from '@app/features/useTransactionsStore';
import React from 'react';
import dayjs from 'dayjs';

const TransactionHistoryModal = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  return (
    <div className="transaction-history-modal">
      {transactions.map((transaction) => (
        <TransactionHistoryItem
          key={transaction.hash}
          transaction={transaction}
        />
      ))}
      <style jsx>{`
        .transaction-history-modal {
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
      <div className="title">{transaction.title}</div>
      <div className="info">
        <a
          href={`https://mumbai.polygonscan.com/tx/${transaction.hash}`}
          target="_blank"
        >
          {transaction.hash}: {transaction.status}
        </a>
      </div>
      <div className="date">
        {dayjs(transaction.date).format('MMM d h:mma')}
      </div>
      <style jsx>{`
        .transaction-item {
          padding: 10px;
          border-bottom: 1px solid white;
        }
      `}</style>
    </div>
  );
};

export default TransactionHistoryModal;
