'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MonthNavigation from '@/components/MonthNavigation';
import IncomeForm from '@/components/IncomeForm';
import { 
  getCurrentMonth, 
  getMonthlyData, 
  addIncome, 
  updateIncome, 
  deleteIncome 
} from '@/lib/storage';
import { MonthlyData, IncomeEntry, CreateIncomeData } from '@/types';

export default function IncomePage() {
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  
  // Form states
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeEntry | null>(null);

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

  // Income handlers
  const handleAddIncome = () => {
    setEditingIncome(null);
    setShowIncomeForm(true);
  };

  const handleEditIncome = (id: string) => {
    const income = monthlyData?.income.find(item => item.id === id);
    if (income) {
      setEditingIncome(income);
      setShowIncomeForm(true);
    }
  };

  const handleDeleteIncome = (id: string) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      deleteIncome(currentMonth, id);
      refreshData();
    }
  };

  const handleIncomeSubmit = (data: CreateIncomeData) => {
    if (editingIncome) {
      updateIncome(currentMonth, editingIncome.id, data);
    } else {
      addIncome(currentMonth, data);
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

  if (!monthlyData) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                💰 Income Management
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage your income sources for {formatMonthDisplay(currentMonth)}
              </p>
            </div>
            <button
              onClick={handleAddIncome}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors font-medium"
            >
              Add Income
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <MonthNavigation currentMonth={currentMonth} onMonthChange={handleMonthChange} />
        
        {/* Income Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-lg">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(monthlyData.summary.totalIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">#</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Income Sources</p>
                <p className="text-2xl font-bold text-blue-600">
                  {monthlyData.income.length}
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
                <p className="text-sm font-medium text-gray-500">Average Income</p>
                <p className="text-2xl font-bold text-purple-600">
                  {monthlyData.income.length > 0 
                    ? formatCurrency(monthlyData.summary.totalIncome / monthlyData.income.length)
                    : formatCurrency(0)
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Income Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Income Entries ({monthlyData.income.length})
            </h3>
          </div>
          
          {monthlyData.income.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">💰</div>
              <p className="text-lg font-medium mb-2 text-gray-900">No income recorded yet</p>
              <p className="text-sm text-gray-600 mb-4">
                Add your first income source to get started tracking your earnings for {formatMonthDisplay(currentMonth)}.
              </p>
              <button
                onClick={handleAddIncome}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Add Your First Income
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyData.income.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.source}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">{formatCurrency(item.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(item.date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditIncome(item.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteIncome(item.id)}
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

        {/* Income Form Modal */}
        <IncomeForm
          isOpen={showIncomeForm}
          onClose={() => {
            setShowIncomeForm(false);
            setEditingIncome(null);
          }}
          onSubmit={handleIncomeSubmit}
          editingEntry={editingIncome}
          currentMonth={currentMonth}
        />
      </div>
    </Layout>
  );
} 