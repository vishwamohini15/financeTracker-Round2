import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, Target, Settings, X, Notebook } from 'lucide-react'; 

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Transactions', path: '/transactions', icon: List },
  { name: 'Budget Goals', path: '/budgets', icon: Target },
  { name: 'Add Transactions', path: '/add-transaction', icon: Notebook },

];

// new props: isOpen aur onClose
const Sidebar = ({ isOpen, onClose }) => { 
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" 
          onClick={onClose} 
        ></div>
      )}

      {/* Actual Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full' 
        } transition-transform duration-300 ease-in-out 
        w-64 bg-gray-800 text-white flex flex-col p-4 space-y-6 
        md:relative md:translate-x-0 md:flex z-30`}
      >
        
        {/* Header/Close Button (Mobile only) */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <div className="text-2xl font-extrabold text-indigo-400">Finance Tracker</div>
          <button 
            onClick={onClose} 
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2" onClick={onClose}> 
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              end={item.path === '/'}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Footer (Settings) */}
        <div className="mt-auto pt-4 border-t border-gray-700">
            <button className="flex items-center space-x-3 p-3 w-full text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;