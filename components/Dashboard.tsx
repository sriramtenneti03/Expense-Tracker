
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { Transaction, TransactionType } from '../types';
import { ChartBarIcon } from './icons';

interface DashboardProps {
  transactions: Transaction[];
}

const SummaryCard: React.FC<{ title: string; amount: number; color: string }> = ({ title, amount, color }) => (
  <div className="bg-card p-6 rounded-lg shadow-md flex-1">
    <h3 className="text-text-secondary text-sm font-medium">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>
      {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
    </p>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Income" amount={totalIncome} color="text-secondary" />
        <SummaryCard title="Total Expense" amount={totalExpense} color="text-danger" />
        <SummaryCard title="Balance" amount={balance} color={balance >= 0 ? 'text-text-primary' : 'text-danger'} />
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-text-primary flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6 text-primary"/>
            Expense Breakdown
        </h3>
        {expenseByCategory.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  // FIX: Added a fallback for 'percent' to prevent type errors during arithmetic operations.
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-text-secondary py-10">No expense data to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;