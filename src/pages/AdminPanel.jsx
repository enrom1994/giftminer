import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Loader from '../components/Loader';

const AdminPanel = ({ userId, isAdmin, onTriggerGiftDistribution, onShardReset }) => {
  if (!userId) {
    return <Loader message="Checking admin status..." />;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center p-4 text-center w-full">
        <Header 
          title="Access Denied"
          subTitle="You do not have permission to view this page."
          className="bg-red-500 dark:bg-red-700 text-white rounded-lg shadow-xl"
        />
        <p className="text-gray-600 dark:text-gray-400 mt-4">Please contact support if you believe this is an error.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <Header 
        title="Admin Panel"
        subTitle="Manage game settings and operations."
        className="bg-red-600 dark:bg-red-800 text-white rounded-lg shadow-xl"
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Admin Actions</h3>
        <div className="space-y-4">
          <button
            onClick={onTriggerGiftDistribution}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-md"
          >
            Trigger Gift Distribution
          </button>
          <button
            onClick={onShardReset}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-md"
          >
            Reset All Shards
          </button>
        </div>
      </div>
    </div>
  );
};

AdminPanel.propTypes = {
  userId: PropTypes.string,
  isAdmin: PropTypes.bool.isRequired,
  onTriggerGiftDistribution: PropTypes.func.isRequired,
  onShardReset: PropTypes.func.isRequired,
};

export default AdminPanel;