import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { formatCurrency } from '../utils/helpers';
import { useFinance } from '../contexts/FinanceContext';

export const Dashboard: React.FC = () => {
  const { state } = useFinance();
  const { stats, currency } = state;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome, currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses, currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.balance, currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Business Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-600">KUBER:</span>
                <span className="font-semibold">{formatCurrency(stats.kuberRevenue, currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600">Nutrify:</span>
                <span className="font-semibold">{formatCurrency(stats.nutrifyRevenue, currency)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transactions yet</p>
            ) : (
              stats.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.category}</p>
                  </div>
                  <div className={`text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    <p className="font-semibold">
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date.toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};