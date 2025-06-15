import { MonthlyData } from '@/types';

interface WelcomeMessageProps {
  monthlyData: MonthlyData;
  onAddIncome: () => void;
  onAddBill: () => void;
  onAddTransaction: () => void;
}

export default function WelcomeMessage({ 
  monthlyData, 
  onAddIncome, 
  onAddBill, 
  onAddTransaction 
}: WelcomeMessageProps) {
  const hasAnyData = 
    monthlyData.income.length > 0 || 
    monthlyData.bills.length > 0 || 
    monthlyData.transactions.length > 0;

  if (hasAnyData) {
    return null; // Don't show welcome message if user has data
  }

  const formatMonthDisplay = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 mb-6">
      <div className="text-center">
        <div className="text-4xl mb-4">👋</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Your Personal Finance Tracker!
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Get started by adding your financial data for <span className="font-semibold">{formatMonthDisplay(monthlyData.month)}</span>. 
          Track your income, bills, and transactions all in one place with our simple monthly-focused approach.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Add Income</h3>
            <p className="text-sm text-gray-600 mb-4">
              Track your salary, freelance payments, investments, and other income sources.
            </p>
            <button
              onClick={onAddIncome}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Add Your First Income
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-semibold text-gray-900 mb-2">Add Bills</h3>
            <p className="text-sm text-gray-600 mb-4">
              Keep track of rent, utilities, subscriptions, and other recurring bills with due dates.
            </p>
            <button
              onClick={onAddBill}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              Add Your First Bill
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-semibold text-gray-900 mb-2">Add Transactions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Record your expenses and other transactions with categories for better insights.
            </p>
            <button
              onClick={onAddTransaction}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Add Your First Transaction
            </button>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          💡 <strong>Tip:</strong> Start with your income and bills, then add transactions as you make them throughout the month.
        </div>
      </div>
    </div>
  );
} 