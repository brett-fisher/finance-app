# Personal Finance Tracker

A simple, monthly-focused personal finance application built with Next.js, TypeScript, and Tailwind CSS.

## 🎯 Overview

This personal finance tracker helps you manage your finances on a month-to-month basis with three core data tables:

-   **💰 Income**: Track salary, freelance payments, investments, and other income sources
-   **📄 Bills**: Manage recurring bills with due dates and payment status
-   **💳 Transactions**: Record expenses and other transactions with categories

## ✨ Features

### Core Functionality

-   **Monthly-Focused Approach**: Organize all financial data by month for easy tracking
-   **Three-Table Structure**: Separate tables for Income, Bills, and Transactions
-   **Real-Time Calculations**: Automatic calculation of totals and net amount (Income - Bills - Transactions)
-   **Data Persistence**: All data stored locally in browser localStorage
-   **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### Income Management

-   Add income with source, amount, date, and description
-   Quick selection buttons for common income sources (Salary, Freelance, etc.)
-   Edit and delete existing income entries
-   Real-time updates to financial summary

### Bills Management

-   Add bills with name, amount, bill date, due date, and description
-   Smart due date validation and "days until due" helper
-   Payment status tracking (paid/unpaid)
-   Quick selection buttons for common bills (Rent, Electric, Phone, etc.)
-   Edit and delete existing bill entries

### Transactions Management

-   Add transactions with category, amount, date, and description
-   Transaction type selection (Expense vs Other)
-   Dynamic categories based on transaction type
-   Comprehensive category system for expenses and other transaction types
-   Edit and delete existing transaction entries

### Financial Insights

-   **Monthly Summary**: Total income, bills, transactions, and net amount
-   **Bills Status**: Count of paid vs unpaid bills
-   **Category Insights**: Most frequently used transaction category
-   **Savings Rate**: Percentage of income saved (net amount / income)
-   **Visual Indicators**: Color-coded amounts (green for positive, red for negative)

### User Experience

-   **Welcome Message**: Helpful onboarding for new users
-   **Month Navigation**: Easy switching between months with previous/next buttons and dropdown
-   **Tabbed Interface**: Clean organization of Income, Bills, and Transactions
-   **Empty States**: Friendly messages when no data exists
-   **Form Validation**: Comprehensive validation with helpful error messages
-   **Confirmation Dialogs**: Prevent accidental deletions

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd finance-app
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the development server**

    ```bash
    npm run dev
    ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🏗️ Tech Stack

-   **Framework**: Next.js 15 with App Router
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Data Storage**: Browser localStorage
-   **Icons**: Unicode emojis for simplicity
-   **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 📱 Usage Guide

### Getting Started

1. **First Visit**: You'll see a welcome message with quick action buttons
2. **Add Income**: Start by adding your monthly income sources
3. **Add Bills**: Record your recurring bills with due dates
4. **Add Transactions**: Log your expenses and other transactions
5. **Review Summary**: Check your financial overview in the summary cards

### Monthly Workflow

1. **Switch Months**: Use the month navigation to view different months
2. **Track Progress**: Monitor your income vs expenses over time
3. **Manage Bills**: Keep track of upcoming due dates and payment status
4. **Categorize Spending**: Use transaction categories to understand spending patterns

### Tips for Best Results

-   **Regular Updates**: Add transactions as they happen for accuracy
-   **Consistent Categories**: Use similar category names for better insights
-   **Monthly Reviews**: Check your financial summary at month-end
-   **Bill Management**: Update payment status when bills are paid

## 🗂️ Data Structure

### Income Entry

```typescript
{
    id: string;
    source: string; // e.g., "Salary", "Freelance"
    amount: number;
    description: string;
    date: string; // ISO date string
    createdAt: string;
    updatedAt: string;
}
```

### Bill Entry

```typescript
{
  id: string;
  name: string;         // e.g., "Electric Bill", "Rent"
  amount: number;
  description: string;
  date: string;         // Bill date
  dueDate: string;      // Due date
  isPaid: boolean;
  paidDate?: string;    // When paid (optional)
  createdAt: string;
  updatedAt: string;
}
```

### Transaction Entry

```typescript
{
    id: string;
    category: string; // e.g., "Food & Dining", "Gas"
    amount: number;
    description: string;
    date: string;
    type: "expense" | "other";
    createdAt: string;
    updatedAt: string;
}
```

## 🎨 Customization

### Adding New Categories

Edit the category arrays in the respective form components:

-   `src/components/TransactionForm.tsx` - Transaction categories
-   `src/components/BillForm.tsx` - Bill types
-   `src/components/IncomeForm.tsx` - Income sources

### Styling Changes

The app uses Tailwind CSS. Modify styles in component files or extend the Tailwind configuration in `tailwind.config.js`.

### Data Storage

Currently uses localStorage. To migrate to a database:

1. Replace functions in `src/lib/storage.ts`
2. Add API routes for CRUD operations
3. Update components to handle async operations

## 🧪 Testing

A comprehensive testing checklist is available in `TESTING_CHECKLIST.md`. Key areas to test:

-   ✅ All CRUD operations (Create, Read, Update, Delete)
-   ✅ Form validation and error handling
-   ✅ Month navigation and data persistence
-   ✅ Financial calculations and summaries
-   ✅ Responsive design on all screen sizes
-   ✅ Browser compatibility

## 🔮 Future Enhancements

### Planned Features

-   **Multi-User Support**: Migrate to Supabase for user accounts
-   **Data Export**: Export data to CSV/PDF
-   **Bill Reminders**: Notifications for upcoming due dates
-   **Budget Planning**: Set monthly budgets by category
-   **Charts & Graphs**: Visual representation of financial data
-   **Recurring Transactions**: Automatic transaction templates

### Migration to Supabase

When ready for multi-user support:

1. Set up Supabase project
2. Create database tables matching current data structure
3. Add authentication
4. Replace localStorage functions with Supabase client calls
5. Add user-specific data filtering

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Built with ❤️ for simple, effective personal finance management**
