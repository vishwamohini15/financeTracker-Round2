import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllTransactions } from '../features/transactions/transactionsSlice';
import { useGetLatestRatesQuery, BASE_CURRENCY } from '../services/exchangeApi';
import { convertToBaseCurrency } from '../utils/currency';
import SpendingChart from './SpendingChart';
import SummaryPanel from './SummaryPanel'; 
import InsightsPanel from './InsightsPanel';
import BudgetStatusCard from './BudgetStatusCard';

const Dashboard = () => {
  const transactions = useSelector(selectAllTransactions);
  
  // RTK Query se rates fetch 
  const { data: ratesData, isLoading, isError } = useGetLatestRatesQuery(BASE_CURRENCY);
  const rates = ratesData?.conversion_rates || {};
  
  // Data Aggregation Logic
  const calculateFinancialSummary = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    // Category-wise expense/income aggregation
    const categorySpending = {}; 
    
    // current month  transactions  filter 
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthTransactions = transactions.filter(t => t.date && t.date.slice(0, 7) === currentMonth);

    currentMonthTransactions.forEach(t => {
      const amountInBase = convertToBaseCurrency(t.amount, t.currency, rates);
      
      if (t.type === 'income') {
        totalIncome += amountInBase;
      } else {
        totalExpense += amountInBase;
      }
      
      // Category-wise data for charts
      if (t.type === 'expense') {
          categorySpending[t.category] = (categorySpending[t.category] || 0) + amountInBase;
      }
    });

    const totalSavings = totalIncome - totalExpense;

    return { 
        totalIncome, 
        totalExpense, 
        totalSavings, 
        categorySpending,
        currentMonthTransactions,
    };
  };

  const summary = calculateFinancialSummary();
  
  // Loading and Error States
  if (isLoading) {
    return (
      <div className="text-center p-10">
        <p className="text-indigo-600 font-semibold">Loading financial data and exchange rates...</p>
        <p className="text-sm text-gray-500 mt-1">Please ensure your internet is connected.</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center p-10 bg-red-100 border-l-4 border-red-500 text-red-700">
        <h3 className="font-bold">Error Connecting to Exchange API</h3>
        <p>Please check your <code>.env</code> file for the correct <code>REACT_APP_EXCHANGE_API_KEY</code> or check network connection.</p>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">Dashboard ({BASE_CURRENCY})</h1>
      
      {/* 1. Summary Cards */}
      <SummaryPanel summary={summary} baseCurrency={BASE_CURRENCY} />
      
      {/* 2. Charts and Insights (Grid layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spending Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Spending Breakdown</h2>
          <SpendingChart categorySpending={summary.categorySpending} />
        </div>
        
        {/* Insights Panel (1/3 width) */}
        <div className="lg:col-span-1">
          <InsightsPanel categorySpending={summary.categorySpending} />
        </div>
      </div>
      
      {/* 3. Recent Transactions (Optional: Can show a small list here or link to full list) */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
       <BudgetStatusCard/>
      </div>

    </div>
  );
};

export default Dashboard;