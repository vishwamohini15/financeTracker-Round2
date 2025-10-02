import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import { exchangeApi } from '../services/exchangeApi';
import transactionsReducer from '../features/transactions/transactionsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import budgetsReducer from '../features/budgets/budgetsSlice';


// 1. Root Reducer banana
const rootReducer = combineReducers({
  transactions: transactionsReducer,
  categories: categoriesReducer,
  budgets: budgetsReducer,
  // RTK Query ko hamesha non-persisted part mein rakhna behtar hai
  [exchangeApi.reducerPath]: exchangeApi.reducer, 
});


// 2. Persist Configuration
const persistConfig = {
  key: 'root', // localStorage mein key
  storage,
  // Exchange API ko persist nahi karenge, woh har baar fetch hoga
  whitelist: ['transactions', 'categories', 'budgets'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


// 3. Store Configure karna
export const store = configureStore({
  reducer: persistedReducer,
  // RTK Query middleware aur Serializability check ko ignore karna zaroori hai redux-persist ke liye
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(exchangeApi.middleware),
});

// 4. Persistor create karna
export const persistor = persistStore(store);