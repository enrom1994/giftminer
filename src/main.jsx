import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initializeFirebaseAndAuth } from './firebaseConfig.js';

// Initialize Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  console.log('Telegram WebApp initialized and expanded.');
} else {
  console.warn('Telegram WebApp object not found. Running outside Telegram environment.');
}

const Root = () => {
  useEffect(() => {
    initializeFirebaseAndAuth();
  }, []); // Run once on component mount

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);