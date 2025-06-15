'use client';

import { useState, useEffect } from 'react';
import { CreateTransactionData, TransactionEntry } from '@/types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionData) => void;
  editingEntry?: TransactionEntry | null;
  currentMonth: string;
}

export default function TransactionForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingEntry, 
  currentMonth 
}: TransactionFormProps) {
  const [formData, setFormData] = useState<CreateTransactionData>({
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Common transaction categories for quick selection
  const expenseCategories = [
    'Food & Dining',
    'Gas & Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Home & Garden',
    'Personal Care',
    'Gifts & Donations',
    'Other'
  ];

  const otherCategories = [
    'Transfer',
    'Investment',
    'Refund',
    'Cash Withdrawal',
    'Other'
  ];

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        category: editingEntry.category,
        amount: editingEntry.amount,
        description: editingEntry.description,
        date: editingEntry.date,
        type: editingEntry.type
      });
    } else {
      // Reset form for new entry
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        category: '',
        amount: 0,
        description: '',
        date: today,
        type: 'expense'
      });
    }
    setErrors({});
  }, [editingEntry, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
    setErrors(prev => ({ ...prev, category: '' }));
  };

  const handleTypeChange = (type: 'expense' | 'other') => {
    setFormData(prev => ({ 
      ...prev, 
      type,
      category: '' // Reset category when type changes
    }));
    setErrors(prev => ({ ...prev, category: '' }));
  };

  const formatMonthDisplay = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getCurrentCategories = () => {
    return formData.type === 'expense' ? expenseCategories : otherCategories;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingEntry ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Month indicator */}
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              💳 Adding transaction for <span className="font-semibold">{formatMonthDisplay(currentMonth)}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    formData.type === 'expense'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  💸 Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('other')}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    formData.type === 'other'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  🔄 Other
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, category: e.target.value }));
                  setErrors(prev => ({ ...prev, category: '' }));
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={formData.type === 'expense' ? 'e.g., Food & Dining, Gas' : 'e.g., Transfer, Investment'}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
              
              {/* Quick category selection */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">
                  Quick select {formData.type === 'expense' ? 'expense' : 'other'} categories:
                </p>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {getCurrentCategories().map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }));
                    setErrors(prev => ({ ...prev, amount: '' }));
                  }}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, date: e.target.value }));
                  setErrors(prev => ({ ...prev, date: '' }));
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }));
                  setErrors(prev => ({ ...prev, description: '' }));
                }}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description of this transaction..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                {editingEntry ? 'Update Transaction' : 'Add Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 