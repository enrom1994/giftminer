// src/pages/Mine.jsx
import React from 'react';
import Header from '../components/Header'; // Import Header

const Mine = ({ minerPowerRate, shardsToClaim, onClaimShards, onGoShopClick }) => {
  return (
    <div className="flex flex-col items-center p-4 w-full">
      <Header 
        title="Your Mine"
        subTitle="Claim your valuable Gift Shards!"
        className="bg-blue-500 dark:bg-blue-700 text-white rounded-lg shadow-xl"
      />
      
      <div className="relative w-48 h-48 mb-6">
        {/* Placeholder for Miner Animation */}
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center animate-pulse">
          <p className="text-gray-600 dark:text-gray-400">Miner Animation</p>
          <span role="img" aria-label="pickaxe" className="text-6xl absolute">⛏️</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Mining Status</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          Your Miner Power Rate: <span className="font-bold text-blue-600 dark:text-blue-400">{minerPowerRate}</span> Shards/Day
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Shards Available to Claim: <span className="font-bold text-green-600 dark:text-green-400">{shardsToClaim.toFixed(2)}</span>
        </p>
        <button
          onClick={onClaimShards}
          disabled={shardsToClaim <= 0}
          className={`w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-md
            ${shardsToClaim <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Claim Shards!
        </button>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
        Want more shards? Upgrade your miner or buy a new one!
      </p>
      <button
        onClick={onGoShopClick}
        className="w-full max-w-md bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-md"
      >
        Buy/Upgrade Miners
      </button>
    </div>
  );
};

export default Mine;