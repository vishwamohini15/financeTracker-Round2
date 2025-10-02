import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  transactions: [],
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: {
      reducer(state, action) {
        state.transactions.push(action.payload);
      },
      // Prepare function se ID aur date automatically generate kar sakte hain
      prepare(transaction) {
        return {
          payload: {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            ...transaction,
          },
        };
      },
    },
    editTransaction: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...updatedData };
      }
    },
    deleteTransaction: (state, action) => {
      const id = action.payload;
      state.transactions = state.transactions.filter(t => t.id !== id);
    },
  },
});

export const { addTransaction, editTransaction, deleteTransaction } = transactionsSlice.actions;

// Selectors
export const selectAllTransactions = (state) => state.transactions.transactions.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

export default transactionsSlice.reducer;