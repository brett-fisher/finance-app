'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MonthNavigation from '@/components/MonthNavigation';
import BillForm from '@/components/BillForm';
import { 
  getCurrentMonth, 
  getMonthlyData, 
  addBill, 
  updateBill, 
  deleteBill 
} from '@/lib/storage';
import { MonthlyData, BillEntry, CreateBillData } from '@/types';

export default function BillsPage() {
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  
  // Form states
  const [showBillForm, setShowBillForm] = useState(false);
  const [editingBill, setEditingBill] = useState<BillEntry | null>(null);

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

  // Bill handlers
  const handleAddBill = () => {
    setEditingBill(null);
    setShowBillForm(true);
  };

  const handleEditBill = (id: string) => {
    const bill = monthlyData?.bills.find(item => item.id === id);
    if (bill) {
      setEditingBill(bill);
      setShowBillForm(true);
    }
  };

  const handleDeleteBill = (id: string) => {
    if (window.confirm('Are you sure you want to delete this bill entry?')) {
      deleteBill(currentMonth, id);
      refreshData();
    }
  };

  const handleBillSubmit = (data: CreateBillData) => {
    if (editingBill) {
      updateBill(currentMonth, editingBill.id, data);
    } else {
      addBill(currentMonth, data);
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

  const getDaysUntilDue = (dueDateStr: string): string => {
    const today = new Date();
    const dueDate = new Date(dueDateStr + 'T00:00:00');
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const getUpcomingBills = () => {
    if (!monthlyData) return [];
    
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return monthlyData.bills
      .filter(bill => !bill.isPaid)
      .filter(bill => {
        const dueDate = new Date(bill.dueDate + 'T00:00:00');
        return dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
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

  const upcomingBills = getUpcomingBills();
  const paidBills = monthlyData.bills.filter(bill => bill.isPaid).length;
  const unpaidBills = monthlyData.bills.filter(bill => !bill.isPaid).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                📄 Bills Management
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage your bills for {formatMonthDisplay(currentMonth)}
              </p>
            </div>
            <button
              onClick={handleAddBill}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors font-medium"
            >
              Add Bill
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <MonthNavigation currentMonth={currentMonth} onMonthChange={handleMonthChange} />
        
        {/* Bills Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold text-lg">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bills</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(monthlyData.summary.totalBills)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-lg">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Paid Bills</p>
                <p className="text-2xl font-bold text-green-600">
                  {paidBills}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold text-lg">⚠</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unpaid Bills</p>
                <p className="text-2xl font-bold text-red-600">
                  {unpaidBills}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-lg">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Due Soon</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {upcomingBills.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Bills Alert */}
        {upcomingBills.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Bills Due Soon</h4>
                <div className="mt-1 text-sm text-yellow-700">
                  {upcomingBills.map((bill, index) => (
                    <span key={bill.id}>
                      {bill.name} ({getDaysUntilDue(bill.dueDate)})
                      {index < upcomingBills.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bills Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Bills ({monthlyData.bills.length})
            </h3>
          </div>
          
          {monthlyData.bills.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-lg font-medium mb-2 text-gray-900">No bills recorded yet</p>
              <p className="text-sm text-gray-600 mb-4">
                Add your first bill to start tracking your monthly expenses for {formatMonthDisplay(currentMonth)}.
              </p>
              <button
                onClick={handleAddBill}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
              >
                Add Your First Bill
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {monthlyData.bills.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-orange-600">{formatCurrency(item.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(item.dueDate)}</div>
                        <div className="text-xs text-gray-500">{getDaysUntilDue(item.dueDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.isPaid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                        {item.isPaid && item.paidDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Paid: {formatDate(item.paidDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditBill(item.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBill(item.id)}
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

        {/* Bill Form Modal */}
        <BillForm
          isOpen={showBillForm}
          onClose={() => {
            setShowBillForm(false);
            setEditingBill(null);
          }}
          onSubmit={handleBillSubmit}
          editingEntry={editingBill}
          currentMonth={currentMonth}
        />
      </div>
    </Layout>
  );
} 