// src/App.jsx
import { useState, useEffect } from 'react';
import { db, auth, appId } from './firebaseConfig.js';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [telegramUser, setTelegramUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  // Effect for Telegram WebApp initialization and user data
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
      setTelegramUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  // Effect for Firebase Auth state and Firestore listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("Firebase user ID:", user.uid);

        // Set up Firestore listener ONLY after authentication is ready
        // For public data, use /artifacts/{appId}/public/data/messages
        const messagesCollectionRef = collection(db, `artifacts/${appId}/public/data/messages`);
        // Note: Removed orderBy to avoid index issues, sort in memory if needed
        const q = query(messagesCollectionRef);

        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
          const fetchedMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(fetchedMessages.sort((a, b) => b.timestamp - a.timestamp)); // Sort by timestamp descending
          console.log("Fetched messages:", fetchedMessages);
        }, (error) => {
          console.error("Error fetching messages:", error);
        });

        return () => unsubscribeFirestore(); // Clean up Firestore listener on unmount or auth change
      } else {
        setUserId(null);
        setMessages([]); // Clear messages if not authenticated
        console.log("No Firebase user is signed in.");
      }
    });

    return () => unsubscribeAuth(); // Clean up auth listener
  }, [db, auth, appId]); // Depend on db, auth, and appId

  const showAlert = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.showAlert(`Count is: ${count}. Hello from Mini App!`);
    } else {
      alert(`Count is: ${count}. This alert is outside Telegram.`);
    }
  };

  const closeApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.close();
    } else {
      alert('Cannot close app outside Telegram.');
    }
  };

  const addMessage = async () => {
    if (message.trim() === '') {
      console.log('Message cannot be empty.');
      return;
    }
    if (!userId) {
      console.log('User not authenticated. Cannot add message.');
      return;
    }

    try {
      // Store public data in /artifacts/{appId}/public/data/messages
      await addDoc(collection(db, `artifacts/${appId}/public/data/messages`), {
        text: message,
        timestamp: Date.now(),
        authorId: userId,
        authorName: telegramUser ? telegramUser.first_name : 'Anonymous',
      });
      setMessage('');
      console.log('Message added successfully!');
    } catch (e) {
      console.error('Error adding message: ', e);
    }
  };

  return (
    <div className="App">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-center items-center mb-6">
            <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1 className="text-3xl font-bold text-center mb-4">Vite + React Telegram Mini App</h1>

          {telegramUser && (
            <p className="text-center text-lg mb-4">
              Hello, {telegramUser.first_name} {telegramUser.last_name || ''} ({telegramUser.username || 'No username'})!
            </p>
          )}

          {userId && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your User ID: <span className="font-mono break-all">{userId}</span>
            </p>
          )}

          <div className="card bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
            <p className="text-center mb-2">Count is {count}</p>
            <button
              onClick={() => setCount((count) => count + 1)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Increment Count
            </button>
          </div>

          <div className="card bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold mb-3">Telegram Actions</h2>
            <div className="flex justify-around gap-2">
              <button
                onClick={showAlert}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Show Telegram Alert
              </button>
              <button
                onClick={closeApp}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Close Mini App
              </button>
            </div>
          </div>

          <div className="card bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold mb-3">Firestore Messages</h2>
            <div className="flex mb-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter a message"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={addMessage}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-r-md transition duration-300"
              >
                Add Message
              </button>
            </div>
            <div className="message-list max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No messages yet. Send one!</p>
              ) : (
                <ul className="space-y-2">
                  {messages.map((msg) => (
                    <li key={msg.id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-sm text-sm">
                      <p className="font-medium">{msg.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        By {msg.authorName || 'Anonymous'} ({new Date(msg.timestamp).toLocaleString()})
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <p className="read-the-docs mt-4 text-gray-600 dark:text-gray-400">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}

export default App;
