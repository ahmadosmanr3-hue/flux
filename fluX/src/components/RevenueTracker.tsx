import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useFinance } from '../contexts/FinanceContext';
import { formatCurrency } from '../utils/helpers';

export const RevenueTracker: React.FC = () => {
  const { state } = useFinance();
  const { revenues, currency } = state;
  
  const [formData, setFormData] = useState({
    source: 'KUBER' as 'KUBER' | 'Nutrify',
    amount: '',
    currency: 'USD' as 'USD' | 'IQD',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.date) {
      alert('Please fill all required fields');
      return;
    }

    dispatch({
      type: 'ADD_REVENUE',
      payload: {
        source: formData.source,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        date: new Date(formData.date),
        description: formData.description || undefined,
      },
    });

    setFormData({
      source: 'KUBER',
      amount: '',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
  };

  const { dispatch } = useFinance();

  const kuberRevenue = revenues.filter(r => r.source === 'KUBER');
  const nutrifyRevenue = revenues.filter(r => r.source === 'Nutrify');

  const totalKuber = kuberRevenue.reduce((sum, r) => sum + r.amount, 0);
  const totalNutrify = nutrifyRevenue.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚗 KUBER Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-4">
              {formatCurrency(totalKuber, currency)}
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {kuberRevenue.length === 0 ? (
                <p className="text-gray-500 text-sm">No revenue recorded</p>
              ) : (
                kuberRevenue.map((revenue) => (
                  <div key={revenue.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{revenue.description || 'Revenue'}</p>
                      <p className="text-gray-500">{revenue.date.toLocaleDateString()}</p>
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(revenue.amount, revenue.currency)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🥗 Nutrify Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-4">
              {formatCurrency(totalNutrify, currency)}
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {nutrifyRevenue.length === 0 ? (
                <p className="text-gray-500 text-sm">No revenue recorded</p>
              ) : (
                nutrifyRevenue.map((revenue) => (
                  <div key={revenue.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{revenue.description || 'Revenue'}</p>
                      <p className="text-gray-500">{revenue.date.toLocaleDateString()}</p>
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(revenue.amount, revenue.currency)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Business Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as 'KUBER' | 'Nutrify' })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="KUBER">KUBER</option>
                  <option value="Nutrify">Nutrify</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'USD' | 'IQD' })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="IQD">IQD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter revenue description"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Add Revenue
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};