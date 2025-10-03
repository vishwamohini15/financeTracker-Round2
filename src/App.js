import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TransactionForm from './features/transactions/TransactionForm';
import TransactionsList from './features/transactions/TransactionsList';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BudgetManager from './features/budgets/BudgetManager';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  // Toggle function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
     <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Component (Updated props and classes) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <Header 
          onMenuClick={toggleSidebar} 
        />
        
        <main 
          className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6"
          // Sidebar open hone par content ko chhota karna (optional)
          onClick={isSidebarOpen ? toggleSidebar : undefined} 
        >
          <Routes>
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/transactions" element={<TransactionsList />} />
            <Route path="/add-transaction" element={<TransactionForm />} />
            <Route path="/edit-transaction/:id" element={<TransactionForm isEdit={true} />} />
            <Route path="/budgets" element={<BudgetManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;