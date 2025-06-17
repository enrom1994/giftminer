// src/components/MinerCard.jsx
import React from 'react';

const MinerCard = ({ miner, onBuyMiner, showBuyButton = true }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{miner.name}</h3>
      <div className="flex items-center justify-center mb-3">
        {/* Placeholder for miner image/animation */}
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-3xl">
          ⛏️
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-1">
        Power: <span className="font-bold text-green-600 dark:text-green-400">{miner.shardsPerDay} Shards/Day</span>
      </p>
      {miner.maxSupply !== undefined && miner.maxSupply !== null && (
         <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
           Supply: {miner.maxSupply === 0 ? 'Unlimited' : `${miner.currentSupply || 0}/${miner.maxSupply}`}
         </p>
      )}
      
      {showBuyButton && (
        <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-4">
          Price: {miner.priceTon} TON
        </p>
      )}

      {showBuyButton && (
        <button
          onClick={() => onBuyMiner(miner.id)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Buy Miner
        </button>
      )}
      {!showBuyButton && miner.quantity && (
        <p className="text-gray-700 dark:text-gray-300 font-medium mt-2">Owned: {miner.quantity}</p>
      )}
    </div>
  );
};

export default MinerCard;