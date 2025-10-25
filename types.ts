
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO format: YYYY-MM-DD
  note?: string;
}

export interface Filters {
  searchTerm: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
}
