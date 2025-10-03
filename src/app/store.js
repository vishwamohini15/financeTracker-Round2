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


const rootReducer = combineReducers({
  transactions: transactionsReducer,
  categories: categoriesReducer,
  budgets: budgetsReducer,
  [exchangeApi.reducerPath]: exchangeApi.reducer, 
});


// 2. Persist Configuration
const persistConfig = {
  key: 'root', 
  storage,
  whitelist: ['transactions', 'categories', 'budgets'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(exchangeApi.middleware),
});

export const persistor = persistStore(store);