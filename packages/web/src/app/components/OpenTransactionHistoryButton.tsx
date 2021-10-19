import useIsMounted from '@app/features/useIsMounted';
import useTransactionsStore from '@app/features/useTransactionsStore';
import React, { useState } from 'react';
import Modal from 'react-modal';
import TransactionHistoryModal from './modals/TransactionHistoryModal';

const OpenTransactionHistoryButton = () => {
  const transactionCount = useTransactionsStore(
    (state) => state.transactions.length
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const isMounted = useIsMounted();
  if (transactionCount === 0) return null;
  if (!isMounted) return null;

  return (
    <>
      <button onClick={openModal}>transactions</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <TransactionHistoryModal />
      </Modal>
      <style jsx>{`
        button {
          display: block;
          padding: 8px 14px;
          border: 0;
          background: #ffe131;
          font-size: 24px;
          font-family: inherit;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.2s ease-in-out;
          color: rgba(0, 0, 0, 1);
          border-bottom: 4px solid rgba(0, 0, 0, 0.3);
        }
        button:hover {
          box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </>
  );
};

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(51, 51, 51, 0.95)',
    backgroundPosition: 'center center',
    backgroundSize: '75%',
    backgroundRepeat: 'no-repeat',
    zIndex: 1112
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: 0,
    padding: 0
  }
};

export default OpenTransactionHistoryButton;
