// src/components/Header.jsx
import React from 'react';

const Header = ({ title, subTitle, className = '' }) => {
  return (
    <header className={`w-full text-center py-4 px-2 mb-6 rounded-b-lg ${className}`}>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">{title}</h1>
      {subTitle && (
        <p className="text-lg text-gray-600 dark:text-gray-400">{subTitle}</p>
      )}
    </header>
  );
};

export default Header;