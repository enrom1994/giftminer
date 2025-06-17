// src/components/BoostCard.jsx
import React from 'react';

const BoostCard = ({ task, onCompleteTask }) => {
  const getButtonText = (action) => {
    switch (action) {
      case 'watchAd': return 'Watch Ad';
      case 'joinChannel': return 'Go to Channel';
      case 'checkIn': return 'Check In';
      case 'spendTon': return 'Complete Quest';
      default: return 'Complete';
    }
  };

  return (
    <li className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <div className="text-center sm:text-left mb-3 sm:mb-0 sm:mr-4 flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{task.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{task.reward}</p>
      </div>
      <button
        onClick={() => onCompleteTask(task.id, task.type, task.reward, task.action)}
        className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
      >
        {getButtonText(task.action)}
      </button>
    </li>
  );
};

export default BoostCard;