import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Transaction, Revenue, DashboardStats } from '../types';
import { generateId } from '../utils/helpers';

interface FinanceState {
  transactions: Transaction[];
  revenues: Revenue[];
  stats: DashboardStats;
  currency: 'USD' | 'IQD';
}

type FinanceAction =
  | { type: 'ADD_TRANSACTION'; payload: Omit<Transaction, 'id'> }
  | { type: 'ADD_REVENUE'; payload: Omit<Revenue, 'id'> }
  | { type: 'SET_CURRENCY'; payload: 'USD' | 'IQD' }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'DELETE_REVENUE'; payload: string };

const initialState: FinanceState = {
  transactions: [],
  revenues: [],
  currency: 'USD',
  stats: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    kuberRevenue: 0,
    nutrifyRevenue: 0,
    recentTransactions: [],
  },
};

const calculateStats = (transactions: Transaction[], revenues: Revenue[]): DashboardStats => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const kuberRevenue = revenues
    .filter(r => r.source === 'KUBER')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const nutrifyRevenue = revenues
    .filter(r => r.source === 'Nutrify')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    balance: income - expenses,
    kuberRevenue,
    nutrifyRevenue,
    recentTransactions,
  };
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const newTransaction: Transaction = {
        ...action.payload,
        id: generateId(),
      };
      const updatedTransactions = [...state.transactions, newTransaction];
      return {
        ...state,
        transactions: updatedTransactions,
        stats: calculateStats(updatedTransactions, state.revenues),
      };
    }
    case 'ADD_REVENUE': {
      const newRevenue: Revenue = {
        ...action.payload,
        id: generateId(),
      };
      const updatedRevenues = [...state.revenues, newRevenue];
      return {
        ...state,
        revenues: updatedRevenues,
        stats: calculateStats(state.transactions, updatedRevenues),
      };
    }
    case 'DELETE_TRANSACTION': {
      const updatedTransactions = state.transactions.filter(t => t.id !== action.payload);
      return {
        ...state,
        transactions: updatedTransactions,
        stats: calculateStats(updatedTransactions, state.revenues),
      };
    }
    case 'DELETE_REVENUE': {
      const updatedRevenues = state.revenues.filter(r => r.id !== action.payload);
      return {
        ...state,
        revenues: updatedRevenues,
        stats: calculateStats(state.transactions, updatedRevenues),
      };
    }
    case 'SET_CURRENCY':
      return {
        ...state,
        currency: action.payload,
      };
    default:
      return state;
  }
};

const FinanceContext = createContext<{
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
} | null>(null);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};