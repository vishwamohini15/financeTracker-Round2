import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  budgetGoals: [],
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudgetGoal: {
      reducer(state, action) {
        const { categoryName, monthYear } = action.payload;
        
        const existingIndex = state.budgetGoals.findIndex(
          (goal) => goal.categoryName === categoryName && goal.monthYear === monthYear
        );

        if (existingIndex !== -1) {
          state.budgetGoals[existingIndex] = { ...state.budgetGoals[existingIndex], ...action.payload };
        } else {
          state.budgetGoals.push({ id: uuidv4(), ...action.payload });
        }
      },
      // monthYear format 'YYYY-MM'
      prepare(categoryName, limit, monthYear = new Date().toISOString().slice(0, 7)) {
        return {
          payload: { categoryName, limit: Number(limit), monthYear },
        };
      },
    },
    deleteBudgetGoal: (state, action) => {
      const id = action.payload;
      state.budgetGoals = state.budgetGoals.filter(goal => goal.id !== id);
    },
  },
});

export const { setBudgetGoal, deleteBudgetGoal } = budgetsSlice.actions;

// Selector
export const selectAllBudgetGoals = (state) => state.budgets.budgetGoals;

export default budgetsSlice.reducer;