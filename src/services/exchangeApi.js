import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API Key ko .env file se load karna
const API_KEY = process.env.REACT_APP_EXCHANGE_API_KEY;

// Base currency jismein hum saare transactions ko convert karenge
export const BASE_CURRENCY = 'INR'; // Ya USD/EUR jo tum default rakhna chaho

export const exchangeApi = createApi({
  reducerPath: 'exchangeApi',
  // Base URL mein API_KEY include karna zaroori hai
  baseQuery: fetchBaseQuery({ 
    baseUrl: `https://v6.exchangerate-api.com/v6/${API_KEY}`,
  }),
  endpoints: (builder) => ({
    // latest/INR endpoint ko call karega
    getLatestRates: builder.query({
      query: (base = BASE_CURRENCY) => `/latest/${base}`,
      // Har 30 minutes (1800000 ms) mein rates ko refetch karna
      // production app mein yeh caching time kam/zyada kar sakte hain
      keepUnusedDataFor: 1800, 
    }),
  }),
});

// Components mein use karne ke liye hook export karna
export const { useGetLatestRatesQuery } = exchangeApi;