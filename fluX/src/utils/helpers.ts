export const CURRENCY_RATES = {
  USD: 1,
  IQD: 1300, // Approximate rate
};

export const TRANSACTION_CATEGORIES = {
  income: [
    { id: 'salary', name: 'Salary', color: '#10b981', icon: '💰', type: 'income' },
    { id: 'freelance', name: 'Freelance', color: '#3b82f6', icon: '💻', type: 'income' },
    { id: 'investment', name: 'Investment', color: '#8b5cf6', icon: '📈', type: 'income' },
    { id: 'kuber', name: 'KUBER', color: '#f59e0b', icon: '🚗', type: 'income' },
    { id: 'nutrify', name: 'Nutrify', color: '#ef4444', icon: '🥗', type: 'income' },
  ],
  expense: [
    { id: 'food', name: 'Food & Dining', color: '#ef4444', icon: '🍔', type: 'expense' },
    { id: 'transport', name: 'Transport', color: '#3b82f6', icon: '🚗', type: 'expense' },
    { id: 'shopping', name: 'Shopping', color: '#8b5cf6', icon: '🛍️', type: 'expense' },
    { id: 'utilities', name: 'Utilities', color: '#f59e0b', icon: '💡', type: 'expense' },
    { id: 'health', name: 'Healthcare', color: '#10b981', icon: '🏥', type: 'expense' },
    { id: 'entertainment', name: 'Entertainment', color: '#ec4899', icon: '🎮', type: 'expense' },
  ],
} as const;

export const formatCurrency = (amount: number, currency: 'USD' | 'IQD'): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  } else {
    return new Intl.NumberFormat('en-IQ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' IQD';
  }
};

export const convertCurrency = (amount: number, from: 'USD' | 'IQD', to: 'USD' | 'IQD'): number => {
  if (from === to) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = from === 'USD' ? amount : amount / CURRENCY_RATES.IQD;
  return to === 'USD' ? usdAmount : usdAmount * CURRENCY_RATES.IQD;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const cn = (...inputs: (string | undefined)[]): string => {
  return inputs.filter(Boolean).join(' ');
};