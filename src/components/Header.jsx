import React from 'react';
import { Menu } from 'lucide-react'; 

const Header = ({ onMenuClick }) => { 
  return (
    // Mobile view and  Desktop hidden
    <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden border-b">
      <h1 className="text-xl font-bold text-indigo-600">F-Tracker</h1>
      
      <button 
        onClick={onMenuClick} 
        className="p-1 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
};

export default Header;