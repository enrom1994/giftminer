// src/components/GiftBox.jsx
import React from 'react';

const GiftBox = ({ gift, currentShards, onExchangeGift }) => {
  const canExchange = currentShards >= gift.shardCost;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700">
      <img src={gift.imageUrl} alt={gift.name} className="w-24 h-24 object-contain mb-3 rounded-md" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{gift.name}</h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Rarity: <span className="font-bold">{gift.rarity}</span></p>
      <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-3">{gift.shardCost} Shards</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Approx. Value: {gift.tonValue} TON</p>
      <button
        onClick={() => onExchangeGift(gift.id, gift.shardCost)}
        disabled={!canExchange}
        className={`w-full py-2 px-4 rounded-md font-semibold transition duration-300
          ${canExchange
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 opacity-70 cursor-not-allowed'
          }`}
      >
        Exchange
      </button>
    </div>
  );
};

export default GiftBox;