'use client';

import { useState, useEffect } from 'react';
import { CreateBillData, BillEntry } from '@/types';

interface BillFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBillData) => void;
  editingEntry?: BillEntry | null;
  currentMonth: string;
}

export default function BillForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingEntry, 
  currentMonth 
}: BillFormProps) {
  const [formData, setFormData] = useState<CreateBillData>({
    name: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Common bill types for quick selection
  const commonBills = [
    'Rent/Mortgage',
    'Electric Bill',
    'Gas Bill',
    'Water Bill',
    'Internet',
    'Phone',
    'Insurance',
    'Credit Card',
    'Car Payment',
    'Subscription',
    'Other'
  ];

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        name: editingEntry.name,
        amount: editingEntry.amount,
        description: editingEntry.description,
        date: editingEntry.date,
        dueDate: editingEntry.dueDate
      });
    } else {
      // Reset form for new entry
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        name: '',
        amount: 0,
        description: '',
        date: today,
        dueDate: today
      });
    }
    setErrors({});
  }, [editingEntry, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Bill name is required';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Check if due date is after the bill date
    if (formData.date && formData.dueDate && formData.dueDate < formData.date) {
      newErrors.dueDate = 'Due date cannot be before the bill date';
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

  const handleBillNameSelect = (name: string) => {
    setFormData(prev => ({ ...prev, name }));
    setErrors(prev => ({ ...prev, name: '' }));
  };

  const formatMonthDisplay = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getDaysUntilDue = (): string => {
    if (!formData.dueDate) return '';
    
    const today = new Date();
    const dueDate = new Date(formData.dueDate + 'T00:00:00');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingEntry ? 'Edit Bill' : 'Add Bill'}
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
          <div className="mb-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-700">
              📄 Adding bill for <span className="font-semibold">{formatMonthDisplay(currentMonth)}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bill Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bill Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Electric Bill, Rent, Phone"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              
              {/* Quick bill name selection */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Quick select:</p>
                <div className="flex flex-wrap gap-1">
                  {commonBills.map((bill) => (
                    <button
                      key={bill}
                      type="button"
                      onClick={() => handleBillNameSelect(bill)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      {bill}
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
                  className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* Date and Due Date Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Bill Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bill Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, date: e.target.value }));
                    setErrors(prev => ({ ...prev, date: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, dueDate: e.target.value }));
                    setErrors(prev => ({ ...prev, dueDate: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.dueDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Due Date Helper */}
            {formData.dueDate && !errors.dueDate && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                📅 {getDaysUntilDue()}
              </div>
            )}

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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description of this bill..."
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
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                {editingEntry ? 'Update Bill' : 'Add Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 