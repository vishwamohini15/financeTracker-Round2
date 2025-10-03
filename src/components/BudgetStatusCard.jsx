// src/components/BudgetStatusCard.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { selectAllBudgetGoals } from '../features/budgets/budgetsSlice';
import { selectAllTransactions } from '../features/transactions/transactionsSlice';
import { useGetLatestRatesQuery, BASE_CURRENCY } from '../services/exchangeApi';
import { convertToBaseCurrency } from '../utils/currency';

const BudgetStatusCard = () => {
    const allGoals = useSelector(selectAllBudgetGoals);
    const transactions = useSelector(selectAllTransactions);
    const { data: ratesData } = useGetLatestRatesQuery(BASE_CURRENCY);
    const rates = ratesData?.conversion_rates || {};
    
    const currentMonthYear = new Date().toISOString().slice(0, 7);
    const currentMonthGoals = allGoals.filter(g => g.monthYear === currentMonthYear);

    if (currentMonthGoals.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                No budget goals set for this month.
            </div>
        );
    }
    
    const budgetStatus = currentMonthGoals.map(goal => {
        let spent = 0;
        const relevantTransactions = transactions.filter(t => 
            t.type === 'expense' && 
            t.category === goal.categoryName && 
            t.date && t.date.slice(0, 7) === currentMonthYear
        );

        relevantTransactions.forEach(t => {
            spent += convertToBaseCurrency(t.amount, t.currency, rates);
        });

        const percentage = (spent / goal.limit) * 100;
        
        return {
            ...goal,
            spent: spent,
            percentage: percentage,
            isOverspent: spent > goal.limit,
            remaining: goal.limit - spent
        };
    }).sort((a, b) => b.percentage - a.percentage); 

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" /> Top Budget Status
            </h3>
            
            {budgetStatus.slice(0, 3).map(status => (
                <div 
                    key={status.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                        status.isOverspent ? 'bg-red-50 border-red-500' : 
                        status.percentage > 80 ? 'bg-orange-50 border-orange-500' : 'bg-green-50 border-green-500'
                    }`}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold">{status.categoryName}</span>
                        <span className={`text-xs font-semibold ${status.isOverspent ? 'text-red-600' : 'text-gray-700'}`}>
                            {status.percentage.toFixed(0)}% Used
                        </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                                status.isOverspent ? 'bg-red-600' : status.percentage > 80 ? 'bg-orange-500' : 'bg-green-600'
                            }`}
                            style={{ width: `${Math.min(status.percentage, 100)}%` }}
                        ></div>
                    </div>

                    {status.isOverspent && (
                        <p className="text-xs mt-1 text-red-600 font-medium flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Overspent!
                        </p>
                    )}
                </div>
            ))}
            
            {/* Link to full budgets page */}
            <p className="text-center pt-2">
                <a href="/budgets" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    View all goals →
                </a>
            </p>
        </div>
    );
};

export default BudgetStatusCard;