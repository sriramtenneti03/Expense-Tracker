
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { XMarkIcon } from './icons';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
  transactionToEdit: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSave, transactionToEdit }) => {
  const getInitialState = () => ({
    title: '',
    amount: '',
    type: TransactionType.EXPENSE,
    category: CATEGORIES[1],
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const [formState, setFormState] = useState(getInitialState());

  useEffect(() => {
    if (transactionToEdit) {
      setFormState({
        ...transactionToEdit,
        amount: String(transactionToEdit.amount),
        date: transactionToEdit.date,
        // FIX: The 'note' property is optional on Transaction but required for form state.
        // Provide a default empty string if it's undefined.
        note: transactionToEdit.note || '',
      });
    } else {
      setFormState(getInitialState());
    }
  }, [transactionToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transactionData = {
      ...formState,
      amount: parseFloat(formState.amount),
    };
    if (transactionToEdit) {
      onSave({ ...transactionData, id: transactionToEdit.id });
    } else {
      onSave(transactionData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-fade-in-down">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
          <XMarkIcon className="h-6 w-6"/>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-text-primary">{transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Title</label>
            <input type="text" id="title" name="title" value={formState.title} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"/>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Amount</label>
            <input type="number" id="amount" name="amount" value={formState.amount} onChange={handleChange} required min="0.01" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Type</label>
            <div className="mt-2 flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="type" value={TransactionType.EXPENSE} checked={formState.type === TransactionType.EXPENSE} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300"/>
                <span className="ml-2 text-sm text-text-primary">Expense</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="type" value={TransactionType.INCOME} checked={formState.type === TransactionType.INCOME} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300"/>
                <span className="ml-2 text-sm text-text-primary">Income</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
            <select id="category" name="category" value={formState.category} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-text-secondary">Date</label>
            <input type="date" id="date" name="date" value={formState.date} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"/>
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-text-secondary">Note (Optional)</label>
            <textarea id="note" name="note" value={formState.note} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"></textarea>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-text-primary px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700">{transactionToEdit ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};