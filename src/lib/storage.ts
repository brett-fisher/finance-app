import { 
  FinanceAppData, 
  MonthlyData, 
  IncomeEntry, 
  BillEntry, 
  TransactionEntry,
  CreateIncomeData,
  CreateBillData,
  CreateTransactionData
} from '@/types';

const STORAGE_KEY = 'finance-app-data';

// Default categories for transactions
const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Home & Garden',
  'Other'
];

// Utility function to get current month in YYYY-MM format
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

// Utility function to generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Initialize default app data
function getDefaultAppData(): FinanceAppData {
  const currentMonth = getCurrentMonth();
  return {
    months: {},
    settings: {
      currentMonth,
      defaultCategories: DEFAULT_CATEGORIES
    }
  };
}

// Initialize default monthly data
function getDefaultMonthlyData(month: string): MonthlyData {
  return {
    month,
    income: [],
    bills: [],
    transactions: [],
    summary: {
      totalIncome: 0,
      totalBills: 0,
      totalTransactions: 0,
      netAmount: 0
    }
  };
}

// Calculate monthly summary
function calculateSummary(monthlyData: MonthlyData): MonthlyData['summary'] {
  const totalIncome = monthlyData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalBills = monthlyData.bills.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = monthlyData.transactions.reduce((sum, item) => sum + item.amount, 0);
  const netAmount = totalIncome - totalBills - totalTransactions;

  return {
    totalIncome,
    totalBills,
    totalTransactions,
    netAmount
  };
}

// Load data from localStorage
export function loadAppData(): FinanceAppData {
  try {
    if (typeof window === 'undefined') {
      return getDefaultAppData();
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultAppData();
    }

    const data: FinanceAppData = JSON.parse(stored);
    
    // Ensure current month exists
    const currentMonth = getCurrentMonth();
    if (!data.months[currentMonth]) {
      data.months[currentMonth] = getDefaultMonthlyData(currentMonth);
    }

    // Update current month in settings
    data.settings.currentMonth = currentMonth;

    return data;
  } catch (error) {
    console.error('Error loading app data:', error);
    return getDefaultAppData();
  }
}

// Save data to localStorage
export function saveAppData(data: FinanceAppData): void {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving app data:', error);
  }
}

// Get monthly data for a specific month
export function getMonthlyData(month: string): MonthlyData {
  const appData = loadAppData();
  
  if (!appData.months[month]) {
    appData.months[month] = getDefaultMonthlyData(month);
    saveAppData(appData);
  }

  return appData.months[month];
}

// Update monthly data and recalculate summary
function updateMonthlyData(month: string, monthlyData: MonthlyData): void {
  const appData = loadAppData();
  
  // Recalculate summary
  monthlyData.summary = calculateSummary(monthlyData);
  
  appData.months[month] = monthlyData;
  saveAppData(appData);
}

// INCOME CRUD OPERATIONS
export function addIncome(month: string, incomeData: CreateIncomeData): IncomeEntry {
  const monthlyData = getMonthlyData(month);
  const now = new Date().toISOString();
  
  const newIncome: IncomeEntry = {
    id: generateId(),
    ...incomeData,
    createdAt: now,
    updatedAt: now
  };

  monthlyData.income.push(newIncome);
  updateMonthlyData(month, monthlyData);
  
  return newIncome;
}

export function updateIncome(month: string, id: string, updates: Partial<CreateIncomeData>): IncomeEntry | null {
  const monthlyData = getMonthlyData(month);
  const incomeIndex = monthlyData.income.findIndex(item => item.id === id);
  
  if (incomeIndex === -1) return null;

  const updatedIncome = {
    ...monthlyData.income[incomeIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  monthlyData.income[incomeIndex] = updatedIncome;
  updateMonthlyData(month, monthlyData);
  
  return updatedIncome;
}

export function deleteIncome(month: string, id: string): boolean {
  const monthlyData = getMonthlyData(month);
  const initialLength = monthlyData.income.length;
  
  monthlyData.income = monthlyData.income.filter(item => item.id !== id);
  
  if (monthlyData.income.length < initialLength) {
    updateMonthlyData(month, monthlyData);
    return true;
  }
  
  return false;
}

// BILLS CRUD OPERATIONS
export function addBill(month: string, billData: CreateBillData): BillEntry {
  const monthlyData = getMonthlyData(month);
  const now = new Date().toISOString();
  
  const newBill: BillEntry = {
    id: generateId(),
    ...billData,
    isPaid: false,
    createdAt: now,
    updatedAt: now
  };

  monthlyData.bills.push(newBill);
  updateMonthlyData(month, monthlyData);
  
  return newBill;
}

export function updateBill(month: string, id: string, updates: Partial<CreateBillData & { isPaid: boolean; paidDate?: string }>): BillEntry | null {
  const monthlyData = getMonthlyData(month);
  const billIndex = monthlyData.bills.findIndex(item => item.id === id);
  
  if (billIndex === -1) return null;

  const updatedBill = {
    ...monthlyData.bills[billIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  monthlyData.bills[billIndex] = updatedBill;
  updateMonthlyData(month, monthlyData);
  
  return updatedBill;
}

export function deleteBill(month: string, id: string): boolean {
  const monthlyData = getMonthlyData(month);
  const initialLength = monthlyData.bills.length;
  
  monthlyData.bills = monthlyData.bills.filter(item => item.id !== id);
  
  if (monthlyData.bills.length < initialLength) {
    updateMonthlyData(month, monthlyData);
    return true;
  }
  
  return false;
}

// TRANSACTIONS CRUD OPERATIONS
export function addTransaction(month: string, transactionData: CreateTransactionData): TransactionEntry {
  const monthlyData = getMonthlyData(month);
  const now = new Date().toISOString();
  
  const newTransaction: TransactionEntry = {
    id: generateId(),
    ...transactionData,
    createdAt: now,
    updatedAt: now
  };

  monthlyData.transactions.push(newTransaction);
  updateMonthlyData(month, monthlyData);
  
  return newTransaction;
}

export function updateTransaction(month: string, id: string, updates: Partial<CreateTransactionData>): TransactionEntry | null {
  const monthlyData = getMonthlyData(month);
  const transactionIndex = monthlyData.transactions.findIndex(item => item.id === id);
  
  if (transactionIndex === -1) return null;

  const updatedTransaction = {
    ...monthlyData.transactions[transactionIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  monthlyData.transactions[transactionIndex] = updatedTransaction;
  updateMonthlyData(month, monthlyData);
  
  return updatedTransaction;
}

export function deleteTransaction(month: string, id: string): boolean {
  const monthlyData = getMonthlyData(month);
  const initialLength = monthlyData.transactions.length;
  
  monthlyData.transactions = monthlyData.transactions.filter(item => item.id !== id);
  
  if (monthlyData.transactions.length < initialLength) {
    updateMonthlyData(month, monthlyData);
    return true;
  }
  
  return false;
}

// UTILITY FUNCTIONS
export function getAvailableMonths(): string[] {
  const appData = loadAppData();
  return Object.keys(appData.months).sort().reverse(); // Most recent first
}

export function getCurrentMonthData(): MonthlyData {
  const currentMonth = getCurrentMonth();
  return getMonthlyData(currentMonth);
} 