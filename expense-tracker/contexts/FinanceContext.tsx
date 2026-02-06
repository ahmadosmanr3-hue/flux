import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
  id: string;
  amount: number;
  currency: 'USD' | 'IQD';
  category: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
}

interface FinanceContextType {
  transactions: Transaction[];
  exchangeRate: number;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateExchangeRate: (rate: number) => void;
  clearAllData: () => void;
  getNetWorth: () => { usd: number; iqd: number };
  getCurrentMonthRevenue: () => number;
  getRecentTransactions: (limit?: number) => Transaction[];
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [exchangeRate, setExchangeRate] = useState(1500);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      const savedRate = await AsyncStorage.getItem('exchangeRate');
      
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
      if (savedRate) {
        setExchangeRate(parseFloat(savedRate));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (newTransactions: Transaction[], newRate: number) => {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
      await AsyncStorage.setItem('exchangeRate', newRate.toString());
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    const newTransactions = [...transactions, newTransaction];
    setTransactions(newTransactions);
    saveData(newTransactions, exchangeRate);
  };

  const deleteTransaction = (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    saveData(newTransactions, exchangeRate);
  };

  const updateExchangeRate = (rate: number) => {
    setExchangeRate(rate);
    saveData(transactions, rate);
  };

  const clearAllData = () => {
    setTransactions([]);
    setExchangeRate(1500);
    AsyncStorage.multiRemove(['transactions', 'exchangeRate']);
  };

  const getNetWorth = () => {
    let totalUSD = 0;
    
    transactions.forEach(transaction => {
      let usdAmount = transaction.amount;
      if (transaction.currency === 'IQD') {
        usdAmount = transaction.amount / exchangeRate;
      }
      
      if (transaction.type === 'income') {
        totalUSD += usdAmount;
      } else {
        totalUSD -= usdAmount;
      }
    });
    
    return {
      usd: totalUSD,
      iqd: totalUSD * exchangeRate
    };
  };

  const getCurrentMonthRevenue = () => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    
    return transactions
      .filter(t => 
        (t.category === 'kuber' || t.category === 'nutrify') &&
        t.type === 'income' &&
        t.date.startsWith(currentMonth)
      )
      .reduce((sum, t) => {
        let usdAmount = t.amount;
        if (t.currency === 'IQD') {
          usdAmount = t.amount / exchangeRate;
        }
        return sum + usdAmount;
      }, 0);
  };

  const getRecentTransactions = (limit: number = 5) => {
    return transactions
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        exchangeRate,
        addTransaction,
        deleteTransaction,
        updateExchangeRate,
        clearAllData,
        getNetWorth,
        getCurrentMonthRevenue,
        getRecentTransactions,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};