// Base currency ko exchangeApi se import karna
import { BASE_CURRENCY } from '../services/exchangeApi'; 

/**
 * Kisi bhi currency amount ko Base Currency mein convert karta hai.
 * @param {number} amount - Original amount
 * @param {string} fromCurrency - Original currency code (e.g., 'USD')
 * @param {object} rates - Exchange rate object (e.g., { 'USD': 1, 'INR': 83.0 })
 * @returns {number} Converted amount in BASE_CURRENCY
 */
export const convertToBaseCurrency = (amount, fromCurrency, rates) => {
  if (!rates || !rates[BASE_CURRENCY]) {
    console.error("Exchange rates not available or missing base currency rate.");
    return amount; // Fallback: conversion possible nahi toh original amount return karo
  }

  // Agar fromCurrency hi Base Currency hai, toh koi conversion nahi
  if (fromCurrency === BASE_CURRENCY) {
    return amount;
  }
  
  // Pehle amount ko Base Currency (jo rates object ki key hai) ke reference se convert karo
  // ExchangeRate-API ka data 'USD' ya jo bhi base request kiya hai uske reference mein hota hai
  // Example: API mein rates[INR] = 83.0 aur rates[USD] = 1.0 (agar base=USD hai)
  
  // Rate = TargetCurrencyRate / FromCurrencyRate (Base currency reference mein)
  
  const rateToBase = rates[BASE_CURRENCY];
  const rateFrom = rates[fromCurrency];

  if (!rateFrom) {
    console.error(`Rate for ${fromCurrency} not found.`);
    return amount; // Fallback
  }
  
  // Formula: Amount * (TargetRate / SourceRate)
  // Humari rates API key ke base (e.g., USD) ke reference mein hai.
  // Toh, pehle amount ko API base currency mein convert karte hain (amount / rateFrom),
  // Phir API base currency se humare app base currency (BASE_CURRENCY) mein convert karte hain (* rateToBase).
  
  // Simpler formula when API base is rates[API_BASE] = 1:
  // Converted_Amount = Original_Amount * rates[BASE_CURRENCY] / rates[fromCurrency]
  
  // Lekin, yahan humara API base, rates object ka base hai (jo humne request kiya, like INR or USD)
  // Agar rates base = USD hai: INR ka rate 83.0
  // USD (10) ko INR (BASE_CURRENCY) mein: 10 * 83.0 / 1.0 = 830
  // EUR (10) ko INR (BASE_CURRENCY) mein: 10 * 83.0 / rates[EUR]
  
  const convertedAmount = amount * (rateToBase / rateFrom);

  return parseFloat(convertedAmount.toFixed(2)); // Do decimal places tak fix karna
};

// Available currencies ki list (API se poori list aati hai, yeh sirf common ones hain)
export const COMMON_CURRENCIES = [
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
];