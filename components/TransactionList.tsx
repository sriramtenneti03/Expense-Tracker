
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { PencilIcon, TrashIcon } from './icons';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onEdit: (transaction: Transaction) => void; onDelete: (id: string) => void; }> = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-secondary' : 'text-danger';
  const amountPrefix = isIncome ? '+' : '-';
  
  return (
    <li className="bg-card p-4 rounded-lg shadow-md flex items-center justify-between space-x-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-text-primary truncate">{transaction.title}</p>
            <p className={`text-lg font-bold ${amountColor} whitespace-nowrap`}>
            {amountPrefix} {transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
        </div>
        <div className="flex items-center justify-between mt-1 text-sm text-text-secondary">
            <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium">{transaction.category}</span>
            <span>{new Date(transaction.date + 'T00:00:00').toLocaleDateString()}</span>
        </div>
         {transaction.note && <p className="text-sm text-text-secondary mt-2 italic">"{transaction.note}"</p>}
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => onEdit(transaction)} className="p-2 text-text-secondary hover:text-primary transition-colors">
          <PencilIcon />
        </button>
        <button onClick={() => onDelete(transaction.id)} className="p-2 text-text-secondary hover:text-danger transition-colors">
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};


export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {transactions.length > 0 ? (
        <ul className="space-y-4">
          {transactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 bg-card rounded-lg shadow-md">
          <p className="text-text-secondary">No transactions found. Add one to get started!</p>
        </div>
      )}
    </div>
  );
};
