import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addTransaction, editTransaction, selectAllTransactions } from './transactionsSlice';
import { selectAllCategories } from '../categories/categoriesSlice';
import { COMMON_CURRENCIES } from '../../utils/currency';

const TransactionForm = ({ isEdit = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const categories = useSelector(selectAllCategories);
  const transactions = useSelector(selectAllTransactions);
  
  const editingTransaction = isEdit ? transactions.find(t => t.id === id) : null;
  
  // 1. State Initialization
  const [formData, setFormData] = useState({
    type: editingTransaction?.type || 'expense', // Default: expense
    amount: editingTransaction?.amount || '',
    currency: editingTransaction?.currency || 'INR',
    category: editingTransaction?.category || (categories.length > 0 ? categories[0].name : ''),
    description: editingTransaction?.description || '',
    date: editingTransaction?.date || new Date().toISOString().slice(0, 10), // YYYY-MM-DD
  });
  
  const [error, setError] = useState({});

  // 2. Editing for useEffect
  useEffect(() => {
    if (isEdit && !editingTransaction) {
      // if ID but not found transaction
      navigate('/transactions'); 
    }
  }, [isEdit, editingTransaction, navigate]);

  // 3. Form Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(prev => ({ ...prev, [name]: '' })); 
  };

  // 4. Form Validation
  const validateForm = () => {
    let isValid = true;
    let newError = {};

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newError.amount = 'Valid amount is required.';
      isValid = false;
    }
    if (!formData.category) {
      newError.category = 'Category is required.';
      isValid = false;
    }
    if (!formData.date) {
      newError.date = 'Date is required.';
      isValid = false;
    }

    setError(newError);
    return isValid;
  };
  
  // 5. Form Submission Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const transactionData = {
        ...formData,
        amount: Number(formData.amount),
    };

    if (isEdit) {
      // EDIT: existing transaction  update 
      dispatch(editTransaction({ id: editingTransaction.id, updatedData: transactionData }));
    } else {
      // ADD: new transaction add 
      dispatch(addTransaction(transactionData)); 
    }
    
    //after Transaction add/edit redirect to Dashboard 
    navigate('/');
  };

  // Type of filtered categories
  const filteredCategories = categories.filter(c => c.type.toLowerCase() === formData.type);
  
  useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.find(c => c.name === formData.category)) {
        setFormData(prev => ({ ...prev, category: filteredCategories[0].name }));
    }
  }, [formData.type, filteredCategories, formData.category]);


  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Type Selector (Income/Expense) */}
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
            className={`flex-1 py-2 rounded-lg text-lg font-semibold transition-colors ${
              formData.type === 'expense' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
            className={`flex-1 py-2 rounded-lg text-lg font-semibold transition-colors ${
              formData.type === 'income' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-500'
            }`}
          >
            Income
          </button>
        </div>
        
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={`mt-1 block w-full border ${error.amount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {error.amount && <p className="text-red-500 text-xs mt-1">{error.amount}</p>}
        </div>

        {/* Currency Selector */}
        <div className="flex space-x-4">
            <div className="flex-1">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {COMMON_CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>
                            {c.code} - {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Category Selector */}
            <div className="flex-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${error.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500`}
                >
                    {filteredCategories.map(c => (
                        <option key={c.id} value={c.name}>
                            {c.icon} {c.name}
                        </option>
                    ))}
                </select>
                {error.category && <p className="text-red-500 text-xs mt-1">{error.category}</p>}
            </div>
        </div>
        
        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`mt-1 block w-full border ${error.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500`}
            max={new Date().toISOString().slice(0, 10)} 
          />
          {error.date && <p className="text-red-500 text-xs mt-1">{error.date}</p>}
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="E.g., Dinner at ABC restaurant"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition-all 
            ${isEdit ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isEdit ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;