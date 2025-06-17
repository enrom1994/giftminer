// src/pages/Home.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header'; // Import Header
import MinerCard from '../components/MinerCard'; // Import MinerCard

const Home = ({ currentShards, ownedMiners, activeBoosts, onGoMineClick }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <Header 
        title={`Welcome, ${user?.displayName || user?.uid || 'Miner'}!`}
        subTitle="Your mining adventure begins here."
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-xl"
      />
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-xl w-full max-w-md text-center mb-6">
        <p className="text-lg">Your Current Shards:</p>
        <p className="text-5xl font-extrabold">{currentShards}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Your Miners</h3>
        {ownedMiners && ownedMiners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Use grid for miner cards */}
            {ownedMiners.map((miner, index) => (
              <MinerCard key={index} miner={{ ...miner, shardsPerDay: miner.powerRate }} showBuyButton={false} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">No miners owned yet. Go to the Mine page to get one!</p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Active Boosts</h3>
        {activeBoosts && activeBoosts.length > 0 ? (
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {activeBoosts.map((boost, index) => (
              <li key={index}>
                {boost.name}: +{boost.percentage}% mining speed for {boost.duration}h
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">No active boosts. Check out tasks for boosts!</p>
        )}
      </div>

      <button
        onClick={onGoMineClick}
        className="w-full max-w-md bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-md"
      >
        Go Mine!
      </button>
    </div>
  );
};

export default Home;