'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MonthNavigation from '@/components/MonthNavigation';
import FinancialSummaryCard from '@/components/FinancialSummaryCard';
import DataTable from '@/components/DataTable';
import IncomeForm from '@/components/IncomeForm';
import BillForm from '@/components/BillForm';
import { 
  getCurrentMonth, 
  getMonthlyData, 
  addIncome, 
  updateIncome, 
  deleteIncome,
  addBill,
  updateBill,
  deleteBill
} from '@/lib/storage';
import { MonthlyData, IncomeEntry, CreateIncomeData, BillEntry, CreateBillData } from '@/types';

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [activeTab, setActiveTab] = useState<'income' | 'bills' | 'transactions'>('income');
  
  // Form states
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeEntry | null>(null);
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

  // Generic handlers for other types
  const handleEditEntry = (id: string) => {
    if (activeTab === 'income') {
      handleEditIncome(id);
    } else if (activeTab === 'bills') {
      handleEditBill(id);
    } else {
      console.log('Edit entry:', id, 'type:', activeTab);
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (activeTab === 'income') {
      handleDeleteIncome(id);
    } else if (activeTab === 'bills') {
      handleDeleteBill(id);
    } else {
      console.log('Delete entry:', id, 'type:', activeTab);
    }
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

  const tabs = [
    { id: 'income' as const, label: 'Income', icon: '💰', count: monthlyData.income.length },
    { id: 'bills' as const, label: 'Bills', icon: '📄', count: monthlyData.bills.length },
    { id: 'transactions' as const, label: 'Transactions', icon: '💳', count: monthlyData.transactions.length },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Month Navigation */}
        <MonthNavigation currentMonth={currentMonth} onMonthChange={handleMonthChange} />
        
        {/* Financial Summary */}
        <FinancialSummaryCard monthlyData={monthlyData} />

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={handleAddIncome}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <span className="mr-2">💰</span>
              Add Income
            </button>
            <button 
              onClick={handleAddBill}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              <span className="mr-2">📄</span>
              Add Bill
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <span className="mr-2">💳</span>
              Add Transaction
            </button>
          </div>
        </div>

        {/* Tabbed Data View */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'income' && (
              <DataTable
                type="income"
                data={monthlyData.income}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            )}
            {activeTab === 'bills' && (
              <DataTable
                type="bills"
                data={monthlyData.bills}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            )}
            {activeTab === 'transactions' && (
              <DataTable
                type="transactions"
                data={monthlyData.transactions}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            )}
          </div>
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
