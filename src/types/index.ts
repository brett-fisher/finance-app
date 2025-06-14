// Base interface for all financial entries
interface BaseFinancialEntry {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

// Income entries - track income sources for the month
export interface IncomeEntry extends BaseFinancialEntry {
  source: string; // e.g., "Salary", "Freelance", "Investment"
}

// Bill entries - track bills and payment status
export interface BillEntry extends BaseFinancialEntry {
  name: string; // e.g., "Electric Bill", "Rent", "Phone"
  dueDate: string; // ISO date string
  isPaid: boolean;
  paidDate?: string; // ISO date string when paid
}

// Transaction entries - general transactions with categories
export interface TransactionEntry extends BaseFinancialEntry {
  category: string; // e.g., "Food", "Gas", "Entertainment"
  type: 'expense' | 'other'; // Most transactions are expenses
}

// Monthly data structure containing all three types
export interface MonthlyData {
  month: string; // Format: "YYYY-MM" e.g., "2024-01"
  income: IncomeEntry[];
  bills: BillEntry[];
  transactions: TransactionEntry[];
  summary: {
    totalIncome: number;
    totalBills: number;
    totalTransactions: number;
    netAmount: number; // income - bills - transactions
  };
}

// App data structure
export interface FinanceAppData {
  months: Record<string, MonthlyData>; // Key is "YYYY-MM"
  settings: {
    currentMonth: string; // "YYYY-MM"
    defaultCategories: string[];
  };
}

// Form data interfaces for creating new entries
export interface CreateIncomeData {
  source: string;
  amount: number;
  description: string;
  date: string;
}

export interface CreateBillData {
  name: string;
  amount: number;
  description: string;
  date: string;
  dueDate: string;
}

export interface CreateTransactionData {
  category: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'other';
} 