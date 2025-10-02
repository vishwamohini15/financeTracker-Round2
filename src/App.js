import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TransactionForm from './features/transactions/TransactionForm';
import TransactionsList from './features/transactions/TransactionsList';
// import BudgetManager from './features/budgets/BudgetManager'; // Naya component name
// import Sidebar from './components/Sidebar'; // Sidebar/Navigation ke liye
// import Header from './components/Header'; // Header component

function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <Routes>
            {/* Main Dashboard route */}
            <Route path="/" element={<Dashboard />} /> 
            
            {/* Transaction Routes */}
            <Route path="/transactions" element={<TransactionsList />} />
            <Route path="/add-transaction" element={<TransactionForm />} />
            <Route path="/edit-transaction/:id" element={<TransactionForm isEdit={true} />} />

            {/* Budget Route */}
            {/* <Route path="/budgets" element={<BudgetManager />} /> */}

            {/* Add more routes if needed */}
            <Route path="*" element={<h1 className="text-3xl font-bold text-red-600">404 Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;