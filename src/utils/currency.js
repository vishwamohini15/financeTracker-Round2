import { BASE_CURRENCY } from '../services/exchangeApi'; 

/**
 * any currency amount ko Base Currency mein convert karta hai.
 * @param {number} amount - Original amount
 * @param {string} fromCurrency - Original currency code (e.g., 'USD')
 * @param {object} rates - Exchange rate object 
 * @returns {number} Converted amount in BASE_CURRENCY
 */
export const convertToBaseCurrency = (amount, fromCurrency, rates) => {
  if (!rates || !rates[BASE_CURRENCY]) {
    console.error("Exchange rates not available or missing base currency rate.");
    return amount; // Fallback: conversion possible 
  }

  // if fromCurrency is Base Currency, so not conversion 
  if (fromCurrency === BASE_CURRENCY) {
    return amount;
  }
  
  
  // Rate = TargetCurrencyRate / FromCurrencyRate (Base currency reference)
  
  const rateToBase = rates[BASE_CURRENCY];
  const rateFrom = rates[fromCurrency];

  if (!rateFrom) {
    console.error(`Rate for ${fromCurrency} not found.`);
    return amount; // Fallback
  }
  
 
  const convertedAmount = amount * (rateToBase / rateFrom);

  return parseFloat(convertedAmount.toFixed(2));  
};

// Available currencies list 
export const COMMON_CURRENCIES = [
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
];