import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectAllTransactions,
  deleteTransaction,
} from "./transactionsSlice";
import {
  useGetLatestRatesQuery,
  BASE_CURRENCY,
} from "../../services/exchangeApi";
import { convertToBaseCurrency } from "../../utils/currency";

const TransactionsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactions = useSelector(selectAllTransactions);

  // fetch exchange rates
  const { data: ratesData, isLoading, isError } = useGetLatestRatesQuery();
  const rates = ratesData?.conversion_rates || {};

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-transaction/${id}`);
  };

  if (isLoading) {
    return (
      <p className="text-center mt-8 text-indigo-600">
        Loading exchange rates for conversion...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center mt-8 text-red-600">
        Error fetching exchange rates. Conversions may be inaccurate.
      </p>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">All Transactions</h2>
        <button
          onClick={() => navigate("/add-transaction")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
        >
          + Add New
        </button>
      </div>

      {/* no transactions */}
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 p-6 bg-white rounded-lg shadow">
          No transactions added yet. Click "+ Add New" to start tracking your
          finances!
        </p>
      ) : (
        // transactions table
        <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount ({BASE_CURRENCY})
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((t) => {
                const convertedAmount = convertToBaseCurrency(
                  t.amount,
                  t.currency,
                  rates
                );

                return (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.category}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {convertedAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {t.amount.toLocaleString("en-IN")} {t.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(t.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
