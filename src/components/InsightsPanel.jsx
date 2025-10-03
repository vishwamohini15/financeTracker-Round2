import React from 'react';
import { Zap } from 'lucide-react';

const InsightsPanel = ({ categorySpending }) => {
  
  // categorySpending object sort 
  const spendingArray = Object.keys(categorySpending)
    .map(category => ({
      name: category,
      value: categorySpending[category],
    }))
    .sort((a, b) => b.value - a.value);

  // 1. Highest Spending Category
  const highestSpending = spendingArray[0];
  
  // 2. High number of small transactions 
  const secondHighest = spendingArray[1];
  
  // Total spending calculate karna
  const totalSpending = spendingArray.reduce((sum, item) => sum + item.value, 0);

  // --- Insights Generate Karna ---
  const insights = [];

  if (highestSpending) {
    const percentage = ((highestSpending.value / totalSpending) * 100).toFixed(0);
    insights.push({
      type: 'warning',
      message: `Highest Spending on **${highestSpending.name}**: This accounts for ${percentage}% of your total monthly expense. Consider setting a budget goal for this.`,
    });
  }
  
  if (secondHighest && secondHighest.value > totalSpending * 0.20) { 
    insights.push({
      type: 'tip',
      message: `Your spending is also significant on **${secondHighest.name}**. Review these two categories to find savings opportunities.`,
    });
  }
  
  if (totalSpending === 0) {
      insights.push({
          type: 'tip',
          message: "You haven't recorded any expenses this month. Start tracking now for better insights!",
      });
  }


  return (
    <div className="bg-indigo-50 p-6 rounded-xl shadow-lg h-full">
      <h2 className="flex items-center text-xl font-semibold text-indigo-800 mb-4">
        <Zap className="w-5 h-5 mr-2" />
        Expense Insights
      </h2>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg text-sm border-l-4 ${
              insight.type === 'warning' 
                ? 'bg-orange-100 border-orange-500 text-orange-800'
                : 'bg-green-100 border-green-500 text-green-800'
            }`}
          >
            <p dangerouslySetInnerHTML={{ __html: insight.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;