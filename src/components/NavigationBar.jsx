// src/components/NavigationBar.jsx
import React from 'react';
import { MdHome, MdGroup, MdShoppingBag, MdChecklist, MdOutlineWorkHistory, MdAdminPanelSettings } from 'react-icons/md'; // Added MdAdminPanelSettings

const navigationItems = [
  { name: 'Home', icon: <MdHome />, page: 'home' }, // Changed path to page identifier
  { name: 'Mine', icon: <MdOutlineWorkHistory />, page: 'mine' },
  { name: 'Friends', icon: <MdGroup />, page: 'friends' }, // Placeholder, not a page yet
  { name: 'Shop', icon: <MdShoppingBag />, page: 'shop' }, // Placeholder, not a page yet
  { name: 'Tasks', icon: <MdChecklist />, page: 'tasks' },
  { name: 'Admin', icon: <MdAdminPanelSettings />, page: 'admin', adminOnly: true }, // Added Admin item
];

const NavigationBar = ({ currentPage, setCurrentPage }) => {
  const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;

  // For 'Friends' and 'Shop', these are placeholders and won't render actual pages yet
  // We'll add alerts for them.
  const handleNavigationClick = (pageName) => {
    if (pageName === 'friends' || pageName === 'shop') {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(`${pageName.charAt(0).toUpperCase() + pageName.slice(1)} page coming soon!`);
      } else {
        alert(`${pageName.charAt(0).toUpperCase() + pageName.slice(1)} page coming soon!`);
      }
    } else {
      setCurrentPage(pageName);
    }
  };

  return (
    <nav
      className={`
        fixed left-0 right-0 z-50
        w-full max-w-xl mx-auto
        bg-white dark:bg-gray-800
        shadow-lg
        flex items-center justify-around
        py-2 ${isTelegramWebApp ? 'pb-4' : 'pb-2'}
        rounded-t-xl
        border-t border-gray-200 dark:border-gray-700
      `}
      style={{ bottom: '0px' }}
    >
      {navigationItems.map((item) => (
        <button // Changed from <a> to <button> for state-based navigation
          key={item.name}
          onClick={() => handleNavigationClick(item.page)}
          className={`
            flex flex-col items-center justify-center
            text-gray-600 dark:text-gray-300
            hover:text-blue-500 dark:hover:text-blue-400
            transition-colors duration-200
            px-2 py-1
            ${currentPage === item.page ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}
            ${item.adminOnly ? 'hidden md:flex' : ''} {/* Hide admin for non-admin context if desired, or handle visibility in App.jsx */}
          `}
          // No href needed since we are managing navigation with state
        >
          <span className="text-xl mb-1">
            {item.icon}
          </span>
          <span className="text-xs font-medium">{item.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationBar;