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
  
  // Formula: Amount * (TargetRate / SourceRate)
 
  
  // Simpler formula when API base is rates[API_BASE] = 1:
  // Converted_Amount = Original_Amount * rates[BASE_CURRENCY] / rates[fromCurrency]
  
  // if rates base = USD hai: INR ka rate 83.0
  // USD (10) to INR (BASE_CURRENCY) mein: 10 * 83.0 / 1.0 = 830
  // EUR (10) to INR (BASE_CURRENCY) mein: 10 * 83.0 / rates[EUR]
  
  const convertedAmount = amount * (rateToBase / rateFrom);

  return parseFloat(convertedAmount.toFixed(2)); // Do decimal places fix 
};

// Available currencies list 
export const COMMON_CURRENCIES = [
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
];