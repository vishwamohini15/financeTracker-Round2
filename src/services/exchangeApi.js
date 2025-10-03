import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API Key ko .env file load
const API_KEY = process.env.REACT_APP_EXCHANGE_API_KEY;

// Base currency all transactions  convert 
export const BASE_CURRENCY = 'INR'; // Ya USD/EUR default 

export const exchangeApi = createApi({
  reducerPath: 'exchangeApi',
  // Base URL API_KEY include needed
  baseQuery: fetchBaseQuery({ 
    baseUrl: `https://v6.exchangerate-api.com/v6/${API_KEY}`,
  }),
  endpoints: (builder) => ({
    // latest/INR endpoint call 
    getLatestRates: builder.query({
      query: (base = BASE_CURRENCY) => `/latest/${base}`,
      keepUnusedDataFor: 1800, 
    }),
  }),
});

export const { useGetLatestRatesQuery } = exchangeApi;