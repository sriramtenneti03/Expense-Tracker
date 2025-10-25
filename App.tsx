
import React, { useState, useMemo, useCallback } from 'react';
import { Transaction, TransactionType, Filters } from './types';
import Dashboard from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { FilterControls } from './components/FilterControls';
import { PlusIcon } from './components/icons';

const sampleTransactions: Transaction[] = [
    { id: '1', title: 'Monthly Salary', amount: 5000, type: TransactionType.INCOME, category: 'Salary', date: '2024-07-01' },
    { id: '2', title: 'Groceries', amount: 150.75, type: TransactionType.EXPENSE, category: 'Groceries', date: '2024-07-05', note: 'Weekly shopping' },
    { id: '3', title: 'Rent', amount: 1200, type: TransactionType.EXPENSE, category: 'Rent', date: '2024-07-01' },
    { id: '4', title: 'Internet Bill', amount: 60, type: TransactionType.EXPENSE, category: 'Utilities', date: '2024-07-10' },
    { id: '5', title: 'Freelance Work', amount: 750, type: TransactionType.INCOME, category: 'Investment', date: '2024-07-15' },
    { id: '6', title: 'Dinner with friends', amount: 85, type: TransactionType.EXPENSE, category: 'Dining Out', date: '2024-07-18' },
];

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    category: '',
    type: '',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = useCallback((name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const searchTermMatch = t.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const typeMatch = filters.type ? t.type === filters.type : true;
        const categoryMatch = filters.category ? t.category === filters.category : true;
        const startDateMatch = filters.startDate ? t.date >= filters.startDate : true;
        const endDateMatch = filters.endDate ? t.date <= filters.endDate : true;
        return searchTermMatch && typeMatch && categoryMatch && startDateMatch && endDateMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filters]);

  const handleOpenForm = (transaction: Transaction | null = null) => {
    setTransactionToEdit(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setTransactionToEdit(null);
    setIsFormOpen(false);
  };

  const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in transactionData) {
      setTransactions(transactions.map(t => t.id === transactionData.id ? transactionData : t));
    } else {
      setTransactions([{ ...transactionData, id: new Date().toISOString() }, ...transactions]);
    }
    handleCloseForm();
  };

  const handleDeleteTransaction = (id: string) => {
    if(window.confirm('Are you sure you want to delete this transaction?')) {
        setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-white text-center">
            Expense Tracker
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          <Dashboard transactions={filteredTransactions} />
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-text-primary">Transactions</h2>
              <button
                onClick={() => handleOpenForm()}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5"/>
                Add Transaction
              </button>
            </div>
            <FilterControls filters={filters} onFilterChange={handleFilterChange} />
            <TransactionList 
                transactions={filteredTransactions} 
                onEdit={handleOpenForm} 
                onDelete={handleDeleteTransaction} 
            />
          </div>
        </div>
      </main>
      <TransactionForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
};

export default App;
