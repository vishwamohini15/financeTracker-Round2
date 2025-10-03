import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addTransaction,
  editTransaction,
  selectAllTransactions,
} from "./transactionsSlice";
import { selectAllCategories } from "../categories/categoriesSlice";
import { COMMON_CURRENCIES } from "../../utils/currency";

const TransactionForm = ({ isEdit = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const categories = useSelector(selectAllCategories);
  const transactions = useSelector(selectAllTransactions);

  const editing = isEdit ? transactions.find((t) => t.id === id) : null;

  const [form, setForm] = useState({
    type: editing?.type || "expense",
    amount: editing?.amount || "",
    currency: editing?.currency || "INR",
    category:
      editing?.category || (categories.length > 0 ? categories[0].name : ""),
    description: editing?.description || "",
    date: editing?.date || new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState({});

  // Redirect back if trying to edit a non-existent transaction
  useEffect(() => {
    if (isEdit && !editing) navigate("/transactions");
  }, [isEdit, editing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Enter a valid amount.";
    if (!form.category) newErrors.category = "Select a category.";
    if (!form.date) newErrors.date = "Date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { ...form, amount: Number(form.amount) };

    if (isEdit) {
      dispatch(editTransaction({ id: editing.id, updatedData: data }));
    } else {
      dispatch(addTransaction(data));
    }

    navigate("/");
  };

  // Filter categories for the selected type (income/expense)
  const filteredCategories = categories.filter(
    (c) => c.type.toLowerCase() === form.type
  );

  useEffect(() => {
    if (
      filteredCategories.length > 0 &&
      !filteredCategories.find((c) => c.name === form.category)
    ) {
      setForm((prev) => ({ ...prev, category: filteredCategories[0].name }));
    }
  }, [form.type, filteredCategories, form.category]);

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, type: "expense" }))}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              form.type === "expense"
                ? "bg-red-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-red-50"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, type: "income" }))}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              form.type === "income"
                ? "bg-green-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-green-50"
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={`mt-1 w-full p-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.amount ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Currency + Category */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm"
            >
              {COMMON_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`mt-1 w-full p-3 border rounded-md shadow-sm ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            max={new Date().toISOString().slice(0, 10)}
            className={`mt-1 w-full p-3 border rounded-md shadow-sm ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <textarea
            name="description"
            rows="2"
            value={form.description}
            onChange={handleChange}
            placeholder="E.g., Dinner at ABC restaurant"
            className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-3 rounded-md text-white font-medium shadow-sm transition ${
            isEdit
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isEdit ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
