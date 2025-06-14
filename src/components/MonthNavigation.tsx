'use client';

import { useState, useEffect } from 'react';
import { getCurrentMonth, getAvailableMonths } from '@/lib/storage';

interface MonthNavigationProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

export default function MonthNavigation({ currentMonth, onMonthChange }: MonthNavigationProps) {
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    const months = getAvailableMonths();
    const current = getCurrentMonth();
    
    // Ensure current month is always available
    const allMonths = months.includes(current) ? months : [current, ...months];
    setAvailableMonths(allMonths);
  }, []);

  const formatMonthDisplay = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const goToPreviousMonth = () => {
    const [year, month] = currentMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    date.setMonth(date.getMonth() - 1);
    const newMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    onMonthChange(newMonth);
  };

  const goToNextMonth = () => {
    const [year, month] = currentMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    date.setMonth(date.getMonth() + 1);
    const newMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    onMonthChange(newMonth);
  };

  const goToCurrentMonth = () => {
    onMonthChange(getCurrentMonth());
  };

  const isCurrentMonth = currentMonth === getCurrentMonth();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Previous Month Button */}
        <button
          onClick={goToPreviousMonth}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Current Month Display */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {formatMonthDisplay(currentMonth)}
          </h2>
          {!isCurrentMonth && (
            <button
              onClick={goToCurrentMonth}
              className="text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              Back to Current Month
            </button>
          )}
        </div>

        {/* Next Month Button */}
        <button
          onClick={goToNextMonth}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          Next
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Month Selector Dropdown */}
      {availableMonths.length > 1 && (
        <div className="mt-4 text-center">
          <select
            value={currentMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {formatMonthDisplay(month)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 