// src/pages/Gifts.jsx
import React from 'react';
import Header from '../components/Header'; // Import Header
import GiftBox from '../components/GiftBox'; // Import GiftBox

const giftsData = [
  { id: 'g1', name: 'Common Gift Box', imageUrl: 'https://via.placeholder.com/100/FF5733/FFFFFF?text=Common', shardCost: 500, tonValue: 5, rarity: 'Common' },
  { id: 'g2', name: 'Rare Gift Crate', imageUrl: 'https://via.placeholder.com/100/33A0FF/FFFFFF?text=Rare', shardCost: 2000, tonValue: 20, rarity: 'Rare' },
  { id: 'g3', name: 'Epic Gift Cache', imageUrl: 'https://via.placeholder.com/100/8A2BE2/FFFFFF?text=Epic', shardCost: 10000, tonValue: 100, rarity: 'Epic' },
  { id: 'g4', name: 'Legendary Gift Vault', imageUrl: 'https://via.placeholder.com/100/DAA520/FFFFFF?text=Legendary', shardCost: 50000, tonValue: 500, rarity: 'Legendary' },
];

const Gifts = ({ currentShards, onExchangeGift }) => {
  return (
    <div className="flex flex-col items-center p-4 w-full">
      <Header 
        title="Exchange Shards for Gifts!"
        subTitle={`Your Current Shards: ${currentShards}`}
        className="bg-green-500 dark:bg-green-700 text-white rounded-lg shadow-xl"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        {giftsData.map(gift => (
          <GiftBox 
            key={gift.id} 
            gift={gift} 
            currentShards={currentShards} 
            onExchangeGift={onExchangeGift} 
          />
        ))}
      </div>
    </div>
  );
};

export default Gifts;