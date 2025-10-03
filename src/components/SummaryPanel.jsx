import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const SummaryPanel = ({ summary, baseCurrency }) => {
  const { totalIncome, totalExpense, totalSavings } = summary;

  // Card Data
  const cards = [
    { 
      title: "Total Income (MoM)", 
      value: totalIncome, 
      color: "bg-green-500", 
      icon: TrendingUp 
    },
    { 
      title: "Total Expenses (MoM)", 
      value: totalExpense, 
      color: "bg-red-500", 
      icon: TrendingDown 
    },
    { 
      title: "Net Savings (MoM)", 
      value: totalSavings, 
      color: totalSavings >= 0 ? "bg-indigo-500" : "bg-orange-500", 
      icon: DollarSign 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div 
          key={card.title} 
          className="bg-white p-6 rounded-xl shadow-lg border-l-4"
          style={{ borderColor: card.color.split('-')[1] }} // Border color dynamic set karna
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${card.color} bg-opacity-10 mr-4`}>
              <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className={`text-2xl font-bold ${card.value >= 0 ? 'text-gray-900' : 'text-orange-500'}`}>
                {baseCurrency} {card.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryPanel;