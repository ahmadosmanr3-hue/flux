export interface Transaction {
  id: string;
  amount: number;
  currency: 'USD' | 'IQD';
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
  source?: 'KUBER' | 'Nutrify' | 'personal';
}

export interface CurrencyRate {
  USD: number;
  IQD: number;
}

export interface Revenue {
  id: string;
  source: 'KUBER' | 'Nutrify';
  amount: number;
  currency: 'USD' | 'IQD';
  date: Date;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  kuberRevenue: number;
  nutrifyRevenue: number;
  recentTransactions: Transaction[];
}