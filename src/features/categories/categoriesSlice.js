import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  // Common categories for both income and expense
  list: [
    { id: uuidv4(), name: 'Salary', type: 'Income', icon: '💰' },
    { id: uuidv4(), name: 'Investments', type: 'Income', icon: '📈' },
    { id: uuidv4(), name: 'Food & Dining', type: 'Expense', icon: '🍔' },
    { id: uuidv4(), name: 'Rent', type: 'Expense', icon: '🏠' },
    { id: uuidv4(), name: 'Entertainment', type: 'Expense', icon: '🎬' },
    { id: uuidv4(), name: 'Utilities', type: 'Expense', icon: '💡' },
    { id: uuidv4(), name: 'Groceries', type: 'Expense', icon: '🛒' },
  ],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      // payload: { name: string, type: 'Income' | 'Expense', icon: string }
      state.list.push({ id: uuidv4(), ...action.payload });
    },
    // Future mein edit/delete bhi add kar sakte hain
  },
});

export const { addCategory } = categoriesSlice.actions;

// Selectors
export const selectAllCategories = (state) => state.categories.list;
export const selectIncomeCategories = (state) => state.categories.list.filter(c => c.type === 'Income');
export const selectExpenseCategories = (state) => state.categories.list.filter(c => c.type === 'Expense');

export default categoriesSlice.reducer;