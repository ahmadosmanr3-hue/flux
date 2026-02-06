import React from 'react';
import { useFinance } from '../contexts/FinanceContext';

export const CurrencySelector: React.FC = () => {
  const { state, dispatch } = useFinance();
  const { currency } = state;

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Display Currency:</label>
      <select
        value={currency}
        onChange={(e) => dispatch({ type: 'SET_CURRENCY', payload: e.target.value as 'USD' | 'IQD' })}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="USD">USD</option>
        <option value="IQD">IQD</option>
      </select>
    </div>
  );
};