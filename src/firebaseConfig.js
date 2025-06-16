// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import for authentication

// Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBDAq2GD3Pfx6S_vzzZ4a54OZJA3Yl8xU",
    authDomain: "giftshardsminer.firebaseapp.com",
    projectId: "giftshardsminer",
    storageBucket: "giftshardsminer.firebasestorage.app",
    messagingSenderId: "404666854983",
    appId: "1:404666854983:web:26de97b3d5d72e4ffe8b62"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
