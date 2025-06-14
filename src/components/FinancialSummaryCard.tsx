import { MonthlyData } from '@/types';

interface FinancialSummaryCardProps {
  monthlyData: MonthlyData;
}

export default function FinancialSummaryCard({ monthlyData }: FinancialSummaryCardProps) {
  const { summary } = monthlyData;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getNetAmountColor = (amount: number): string => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const summaryItems = [
    {
      label: 'Total Income',
      amount: summary.totalIncome,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: '↗',
      count: monthlyData.income.length,
    },
    {
      label: 'Total Bills',
      amount: summary.totalBills,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      icon: '📄',
      count: monthlyData.bills.length,
    },
    {
      label: 'Total Transactions',
      amount: summary.totalTransactions,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: '↘',
      count: monthlyData.transactions.length,
    },
    {
      label: 'Net Amount',
      amount: summary.netAmount,
      color: getNetAmountColor(summary.netAmount),
      bgColor: summary.netAmount >= 0 ? 'bg-green-100' : 'bg-red-100',
      icon: summary.netAmount >= 0 ? '✓' : '⚠',
      count: null,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${item.bgColor} rounded-full flex items-center justify-center`}>
                <span className={`${item.color} font-semibold text-sm`}>{item.icon}</span>
              </div>
              {item.count !== null && (
                <span className="text-xs text-gray-500">
                  {item.count} {item.count === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className={`text-xl font-semibold ${item.color}`}>
                {formatCurrency(item.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional insights */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Bills Status:</span>{' '}
            {monthlyData.bills.length > 0 ? (
              <>
                {monthlyData.bills.filter(bill => bill.isPaid).length} paid, {' '}
                {monthlyData.bills.filter(bill => !bill.isPaid).length} unpaid
              </>
            ) : (
              'No bills recorded'
            )}
          </div>
          
          <div>
            <span className="font-medium">Most Used Category:</span>{' '}
            {monthlyData.transactions.length > 0 ? (
              (() => {
                const categories = monthlyData.transactions.reduce((acc, transaction) => {
                  acc[transaction.category] = (acc[transaction.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                const mostUsed = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
                return mostUsed ? `${mostUsed[0]} (${mostUsed[1]})` : 'None';
              })()
            ) : (
              'No transactions recorded'
            )}
          </div>
          
          <div>
            <span className="font-medium">Savings Rate:</span>{' '}
            {summary.totalIncome > 0 ? (
              `${Math.round((summary.netAmount / summary.totalIncome) * 100)}%`
            ) : (
              'N/A'
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 