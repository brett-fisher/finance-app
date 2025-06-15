'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MonthNavigation from '@/components/MonthNavigation';
import TransactionForm from '@/components/TransactionForm';
import { 
  getCurrentMonth, 
  getMonthlyData, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '@/lib/storage';
import { MonthlyData, TransactionEntry, CreateTransactionData } from '@/types';

export default function TransactionsPage() {
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  
  // Form states
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionEntry | null>(null);

  useEffect(() => {
    const data = getMonthlyData(currentMonth);
    setMonthlyData(data);
  }, [currentMonth]);

  const refreshData = () => {
    const data = getMonthlyData(currentMonth);
    setMonthlyData(data);
  };

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
  };

  // Transaction handlers
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowTransactionForm(true);
  };

  const handleEditTransaction = (id: string) => {
    const transaction = monthlyData?.transactions.find(item => item.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setShowTransactionForm(true);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(currentMonth, id);
      refreshData();
    }
  };

  const handleTransactionSubmit = (data: CreateTransactionData) => {
    if (editingTransaction) {
      updateTransaction(currentMonth, editingTransaction.id, data);
    } else {
      addTransaction(currentMonth, data);
    }
    refreshData();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatMonthDisplay = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getCategoryInsights = () => {
    if (!monthlyData) return [];
    
    const categoryTotals: { [key: string]: number } = {};
    
    monthlyData.transactions.forEach(transaction => {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount;
      } else {
        categoryTotals[transaction.category] = transaction.amount;
      }
    });
    
    return Object.entries(categoryTotals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Top 5 categories
  };

  if (!monthlyData) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  const categoryInsights = getCategoryInsights();
  const expenseTransactions = monthlyData.transactions.filter(t => t.type === 'expense').length;
  const otherTransactions = monthlyData.transactions.filter(t => t.type === 'other').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                💳 Transactions Management
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage your transactions for {formatMonthDisplay(currentMonth)}
              </p>
            </div>
            <button
              onClick={handleAddTransaction}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <MonthNavigation currentMonth={currentMonth} onMonthChange={handleMonthChange} />
        
        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(monthlyData.summary.totalTransactions)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold text-lg">📤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {expenseTransactions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-lg">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Other</p>
                <p className="text-2xl font-bold text-purple-600">
                  {otherTransactions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-lg">#</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Count</p>
                <p className="text-2xl font-bold text-gray-600">
                  {monthlyData.transactions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Insights */}
        {categoryInsights.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              {categoryInsights.map((insight, index) => (
                <div key={insight.category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{insight.category}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {formatCurrency(insight.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Transactions ({monthlyData.transactions.length})
            </h3>
          </div>
          
          {monthlyData.transactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">💳</div>
              <p className="text-lg font-medium mb-2 text-gray-900">No transactions recorded yet</p>
              <p className="text-sm text-gray-600 mb-4">
                Add your first transaction to start tracking your spending for {formatMonthDisplay(currentMonth)}.
              </p>
              <button
                onClick={handleAddTransaction}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Add Your First Transaction
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyData.transactions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-600">{formatCurrency(item.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.type === 'expense' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item.type === 'expense' ? 'Expense' : 'Other'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(item.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditTransaction(item.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transaction Form Modal */}
        <TransactionForm
          isOpen={showTransactionForm}
          onClose={() => {
            setShowTransactionForm(false);
            setEditingTransaction(null);
          }}
          onSubmit={handleTransactionSubmit}
          editingEntry={editingTransaction}
          currentMonth={currentMonth}
        />
      </div>
    </Layout>
  );
} 