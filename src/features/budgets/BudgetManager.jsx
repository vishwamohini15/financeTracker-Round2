import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBudgetGoal,
  deleteBudgetGoal,
  selectAllBudgetGoals,
} from "../budgets/budgetsSlice";
import { selectExpenseCategories } from "../categories/categoriesSlice";
import { selectAllTransactions } from "../transactions/transactionsSlice";
import {
  useGetLatestRatesQuery,
  BASE_CURRENCY,
} from "../../services/exchangeApi";
import { convertToBaseCurrency } from "../../utils/currency";
import { X, Target, Save } from "lucide-react";

const BudgetManager = () => {
  const dispatch = useDispatch();
  const expenseCategories = useSelector(selectExpenseCategories);
  const allGoals = useSelector(selectAllBudgetGoals);
  const transactions = useSelector(selectAllTransactions);

  // fetch exchange rates
  const { data: ratesData } = useGetLatestRatesQuery(BASE_CURRENCY);
  const rates = ratesData?.conversion_rates || {};

  // form state
  const [categoryName, setCategoryName] = useState(
    expenseCategories[0]?.name || ""
  );
  const [limit, setLimit] = useState("");

  const currentMonthYear = new Date().toISOString().slice(0, 7);

  const handleSetGoal = (e) => {
    e.preventDefault();
    const numLimit = Number(limit);

    if (!categoryName || numLimit <= 0 || isNaN(numLimit)) {
      alert("Please select a category and enter a valid positive limit.");
      return;
    }

    dispatch(setBudgetGoal(categoryName, numLimit, currentMonthYear));
    setLimit("");
  };

  // calculate total spent for a category this month
  const calculateSpending = (category) => {
    const relevant = transactions.filter(
      (t) =>
        t.type === "expense" &&
        t.category === category &&
        t.date?.slice(0, 7) === currentMonthYear
    );

    return relevant.reduce(
      (sum, t) => sum + convertToBaseCurrency(t.amount, t.currency, rates),
      0
    );
  };

  const currentMonthGoals = allGoals.filter(
    (g) => g.monthYear === currentMonthYear
  );

  return (
    <div className="p-4 md:p-6 space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
        <Target className="w-7 h-7 mr-2 text-indigo-600" />
        Monthly Budget Goals
      </h1>

      {/* Goal setter form */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Set or Update Goal for {currentMonthYear}
        </h2>

        <form
          onSubmit={handleSetGoal}
          className="flex flex-col md:flex-row gap-4 items-end"
        >
          {/* category */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Expense Category
            </label>
            <select
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              required
            >
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* limit */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Monthly Limit ({BASE_CURRENCY})
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="e.g. 5000"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
              min="1"
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Set Goal
          </button>
        </form>
      </div>

      {/* Goals list */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Current Goals Status
        </h2>

        {currentMonthGoals.length === 0 ? (
          <p className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
            No budget goals set for {currentMonthYear}. Please set a goal above.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMonthGoals.map((goal) => {
              const spent = calculateSpending(goal.categoryName);
              const remaining = goal.limit - spent;
              const percentage = (spent / goal.limit) * 100;

              let progressColor = "bg-green-500";
              if (percentage > 80 && percentage <= 100) {
                progressColor = "bg-orange-500";
              } else if (percentage > 100) {
                progressColor = "bg-red-600";
              }

              return (
                <div
                  key={goal.id}
                  className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {goal.categoryName}
                  </h3>

                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-gray-600">Spent:</span>
                    <span
                      className={`font-semibold ${
                        spent > goal.limit ? "text-red-600" : "text-gray-800"
                      }`}
                    >
                      {BASE_CURRENCY}{" "}
                      {spent.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mb-3 font-medium">
                    <span className="text-gray-600">Limit:</span>
                    <span className="font-semibold text-indigo-600">
                      {BASE_CURRENCY} {goal.limit.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>

                  {/* feedback */}
                  <p
                    className={`text-sm font-semibold text-center mt-3 ${
                      remaining >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {remaining >= 0
                      ? `${BASE_CURRENCY} ${remaining.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })} Remaining`
                      : `Overspent by ${BASE_CURRENCY} ${Math.abs(
                          remaining
                        ).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}! 🚨`}
                  </p>

                  {/* delete */}
                  <button
                    onClick={() => dispatch(deleteBudgetGoal(goal.id))}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full"
                    title="Delete Goal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
