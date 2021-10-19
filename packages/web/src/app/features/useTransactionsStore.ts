import { Pixels } from '@app/hooks/use-editor';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import getJsonRpcProvider from './getJsonRpcProvider';

export type LocalTransactionState = {
  title: string;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  x?: number;
  y?: number;
  pixels?: Pixels;
  type: 'create-tile' | 'invite-neighbor';
  date: Date;
};

type TransactionStore = {
  transactions: LocalTransactionState[];
  addTransaction: (transaction: LocalTransactionState) => void;
  initialize: () => void;
  clearAll: () => void;
};

const useTransactionsStore = create<TransactionStore>(
  persist(
    (set, get) => ({
      transactions: [],
      initialize: () => {
        const provider = getJsonRpcProvider();
        for (const transaction of get().transactions.filter(
          (t) => t.status === 'pending'
        )) {
          provider.getTransaction(transaction.hash).then((tx) => {
            tx.wait().then((receipt) => {
              console.log({ receipt });
              set((transactions) => ({
                ...transactions,
                transactions: transactions.transactions.map((t) =>
                  t.hash === transaction.hash
                    ? { ...t, status: 'confirmed' }
                    : t
                )
              }));
            });
          });
        }
      },
      addTransaction: (transaction: LocalTransactionState) => {
        set((state) => ({
          transactions: [...state.transactions, transaction]
        }));
        const provider = getJsonRpcProvider();
        provider.getTransaction(transaction.hash).then((tx) => {
          tx.wait().then((receipt) => {
            console.log({ receipt });
            set((transactions) => ({
              ...transactions,
              transactions: transactions.transactions.map((t) =>
                t.hash === transaction.hash ? { ...t, status: 'confirmed' } : t
              )
            }));
          });
        });
      },
      clearAll: () => set({ transactions: [] })
    }),
    {
      name: 'exquisite-land-transactions'
    }
  )
);

export default useTransactionsStore;
