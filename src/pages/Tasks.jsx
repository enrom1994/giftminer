// src/pages/Tasks.jsx
import React from 'react';
import Header from '../components/Header'; // Import Header
import BoostCard from '../components/BoostCard'; // Import BoostCard

const tasksData = [
  { id: 't1', name: 'Watch an Ad', reward: '+30% Mining Speed (4h)', type: 'boost', action: 'watchAd' },
  { id: 't2', name: 'Join Partner Channel', reward: '50 Shards instantly', type: 'shards', action: 'joinChannel' },
  { id: 't3', name: 'Daily Check-In', reward: '1-5% bonus tomorrow', type: 'bonus', action: 'checkIn' },
  { id: 't4', name: 'Spend 3 TON', reward: '+10% Mining (24h)', type: 'quest', action: 'spendTon' },
];

const Tasks = ({ onCompleteTask }) => {
  return (
    <div className="flex flex-col items-center p-4 w-full">
      <Header 
        title="Daily Tasks & Quests"
        subTitle="Complete tasks to earn shards and boosts!"
        className="bg-orange-500 dark:bg-orange-700 text-white rounded-lg shadow-xl"
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md">
        <ul className="space-y-4">
          {tasksData.map(task => (
            <BoostCard 
              key={task.id} 
              task={task} 
              onCompleteTask={onCompleteTask} 
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;