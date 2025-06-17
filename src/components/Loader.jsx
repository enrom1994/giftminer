// src/components/Loader.jsx
import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
      <p className="text-blue-600 dark:text-blue-400 text-lg">{message}</p>
    </div>
  );
};

export default Loader;