import { useState, useEffect, useCallback } from 'react';
import { db, auth, appId } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  FieldValue
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import NavigationBar from './components/NavigationBar.jsx';
import Loader from './components/Loader.jsx';
import Home from './pages/Home.jsx';
import Mine from './pages/Mine.jsx';
import Gifts from './pages/Gifts.jsx';
import Tasks from './pages/Tasks.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import './App.css';

// Master data for miners
const MINER_MASTER_DATA = {
  'free-miner': { id: 'free-miner', name: 'Free Miner', shardsPerDay: 5, priceTon: 0, maxSupply: 0 },
  'bronze-miner': { id: 'bronze-miner', name: 'Bronze Miner', shardsPerDay: 20, priceTon: 1, maxSupply: 5000 },
  'silver-miner': { id: 'silver-miner', name: 'Silver Miner', shardsPerDay: 120, priceTon: 5, maxSupply: 2000 },
  'gold-miner': { id: 'gold-miner', name: 'Gold Miner', shardsPerDay: 300, priceTon: 15, maxSupply: 500 },
  'mythic-miner': { id: 'mythic-miner', name: 'Mythic Miner', shardsPerDay: 2000, priceTon: 100, maxSupply: 100 },
};

function App() {
  const [telegramUser, setTelegramUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentShards, setCurrentShards] = useState(0);
  const [ownedMiners, setOwnedMiners] = useState([]);
  const [activeBoosts, setActiveBoosts] = useState([]);
  const [shardsToClaim, setShardsToClaim] = useState(0);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [errorId, setErrorId] = useState(null); // For debouncing alerts
  const functions = getFunctions();

  // Calculate accumulated shards since last claim time
  const calculateShardsToClaim = useCallback((lastClaimTime, miners) => {
    if (!lastClaimTime || miners.length === 0) return 0;

    const now = Date.now();
    const elapsedTimeMs = now - lastClaimTime;
    const elapsedTimeDays = elapsedTimeMs / (1000 * 60 * 60 * 24);

    const totalMinerPowerRate = miners.reduce((sum, miner) => {
      const masterMiner = MINER_MASTER_DATA[miner.minerId];
      return sum + (masterMiner ? masterMiner.shardsPerDay * miner.quantity : 0);
    }, 0);

    const boostedPowerRate = activeBoosts.reduce((currentRate, boost) => {
      if (now < boost.endTime) {
        return currentRate * (1 + (boost.percentage / 100));
      }
      return currentRate;
    }, totalMinerPowerRate);

    return boostedPowerRate * elapsedTimeDays;
  }, [activeBoosts]);

  // Authentication and Firestore data fetching
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
      setTelegramUser(window.Telegram.WebApp.initDataUnsafe.user);
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("Firebase user ID:", user.uid);
        setUserDataLoading(true);

        // Check admin status
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDocSnap = await getDoc(adminDocRef);
        setIsAdmin(adminDocSnap.exists() && adminDocSnap.data().role === 'admin');

        // Fetch user game data
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeUserData = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setCurrentShards(userData.shards || 0);
            setOwnedMiners(userData.miners || []);
            setActiveBoosts(userData.activeBoosts || []);
            const calculatedShards = calculateShardsToClaim(
              userData.lastClaimTime ? userData.lastClaimTime.toMillis() : Date.now(),
              userData.miners || []
            );
            setShardsToClaim(calculatedShards);
            console.log("User data fetched:", userData);
            setErrorId(null); // Clear error on successful fetch
          } else {
            console.log("User document not found, creating default.");
            setDoc(userDocRef, {
              shards: 0,
              ton: 0,
              lastClaimTime: serverTimestamp(),
              miners: [{ minerId: 'free-miner', quantity: 1 }],
              activeBoosts: [],
            }).then(() => {
              console.log("Default user document created.");
            }).catch(error => {
              console.error("Error creating user document:", error);
              if (errorId !== error.message) {
                window.Telegram?.WebApp?.showAlert('Failed to create user data.');
                setErrorId(error.message);
              }
            });
          }
          setUserDataLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          if (errorId !== error.message) {
            window.Telegram?.WebApp?.showAlert('Failed to load user data.');
            setErrorId(error.message);
          }
          setUserDataLoading(false);
        });

        // Messages listener (disabled as per user request)
        // const messagesCollectionRef = collection(db, `artifacts/${appId}/public/data/messages`);
        // const q = query(messagesCollectionRef, orderBy('timestamp', 'desc'));
        // const unsubscribeFirestoreMessages = onSnapshot(q, (snapshot) => {
        //   const fetchedMessages = snapshot.docs.map(doc => ({
        //     id: doc.id,
        //     ...doc.data()
        //   }));
        //   setMessages(fetchedMessages);
        // }, (error) => {
        //   console.error("Error fetching messages:", error);
        //   if (errorId !== error.message) {
        //     window.Telegram?.WebApp?.showAlert('Failed to load messages.');
        //     setErrorId(error.message);
        //   }
        // });

        return () => {
          unsubscribeAuth();
          unsubscribeUserData();
          // unsubscribeFirestoreMessages();
        };
      } else {
        setUserId(null);
        setTelegramUser(null);
        setCurrentShards(0);
        setOwnedMiners([]);
        setActiveBoosts([]);
        setShardsToClaim(0);
        setUserDataLoading(false);
        setIsAdmin(false);
        setMessages([]);
        setErrorId(null); // Reset error state
        console.log("No Firebase user is signed in.");
      }
    });

    return () => unsubscribeAuth();
  }, [db, auth, appId, calculateShardsToClaim, errorId]);

  // Handler functions
  const handleGoMineClick = useCallback(() => {
    setCurrentPage('mine');
  }, []);

  const handleClaimShards = useCallback(async () => {
    if (shardsToClaim <= 0 || !userId) return;

    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        shards: currentShards + shardsToClaim,
        lastClaimTime: serverTimestamp(),
      });
      window.Telegram?.WebApp?.showAlert(`Successfully claimed ${shardsToClaim.toFixed(2)} shards!`);
      setShardsToClaim(0);
    } catch (error) {
      console.error("Error claiming shards:", error);
      window.Telegram?.WebApp?.showAlert('Failed to claim shards. Please try again.');
    }
  }, [shardsToClaim, currentShards, userId, db]);

  const handleGoShopClick = useCallback(() => {
    window.Telegram?.WebApp?.showAlert('Shop functionality coming soon!');
  }, []);

  const handleExchangeGift = useCallback(async (giftId, shardCost) => {
    if (currentShards < shardCost || !userId) {
      const needed = shardCost - currentShards;
      window.Telegram?.WebApp?.showAlert(`Not enough shards! You need ${needed} more.`);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        shards: currentShards - shardCost,
        inventory: FieldValue.arrayUnion({
          giftId,
          claimedAt: serverTimestamp(),
        }),
      });
      window.Telegram?.WebApp?.showAlert(`Successfully exchanged for gift ${giftId}!`);
      console.log(`Exchanged gift ${giftId} for ${shardCost} shards.`);
    } catch (error) {
      console.error("Error exchanging gift:", error);
      window.Telegram?.WebApp?.showAlert('Failed to exchange gift. Please try again.');
    }
  }, [currentShards, userId, db]);

  const handleCompleteTask = useCallback(async (taskId, type, reward, action) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, 'users', userId);
      if (type === 'shards') {
        const rewardAmount = parseInt(reward.match(/\d+/)[0]);
        await updateDoc(userDocRef, {
          shards: currentShards + rewardAmount,
          completedTasks: FieldValue.arrayUnion(taskId),
        });
        window.Telegram?.WebApp?.showAlert(`Claimed ${rewardAmount} shards from "${action}" task!`);
      } else if (type === 'boost') {
        const boostMatch = reward.match(/\+(\d+)% Mining Speed \((\d+)h\)/);
        if (boostMatch) {
          const percentage = parseInt(boostMatch[1]);
          const hours = parseInt(boostMatch[2]);
          const endTime = new Date(Date.now() + hours * 60 * 60 * 1000);
          await updateDoc(userDocRef, {
            activeBoosts: FieldValue.arrayUnion({
              boostId: taskId,
              name: `${percentage}% Mining Boost`,
              percentage,
              endTime: FieldValue.serverTimestamp(),
            }),
          });
          window.Telegram?.WebApp?.showAlert(`Task "${taskId}" (${action}) completed! Boost: ${reward}`);
        }
      } else {
        window.Telegram?.WebApp?.showAlert(`Task "${taskId}" (${action}) completed! Reward: ${reward}`);
      }
      console.log(`Task ${taskId} completed: ${reward}`);
    } catch (error) {
      console.error("Error completing task:", error);
      window.Telegram?.WebApp?.showAlert('Failed to complete task. Please try again.');
    }
  }, [userId, currentShards, db]);

  const handleTriggerGiftDistribution = useCallback(async () => {
    if (!window.confirm('Are you sure you want to trigger gift distribution?')) return;
    try {
      const triggerGiftDistribution = httpsCallable(functions, 'triggerGiftDistribution');
      const result = await triggerGiftDistribution();
      window.Telegram?.WebApp?.showAlert(result.data.message);
      console.log('Gift distribution triggered:', result.data);
    } catch (error) {
      console.error('Error triggering gift distribution:', error);
      window.Telegram?.WebApp?.showAlert('Failed to trigger gift distribution: ' + error.message);
    }
  }, [functions]);

  const handleShardReset = useCallback(async () => {
    if (!window.confirm('Are you sure you want to reset ALL shards?')) return;
    try {
      const shardReset = httpsCallable(functions, 'shardReset');
      const result = await shardReset();
      window.Telegram?.WebApp?.showAlert(result.data.message);
      console.log('Shard reset triggered:', result.data);
    } catch (error) {
      console.error('Error resetting shards:', error);
      window.Telegram?.WebApp?.showAlert('Failed to reset shards: ' + error.message);
    }
  }, [functions]);

  const renderPage = () => {
    if (userDataLoading) {
      return <Loader message="Loading game data..." />;
    }

    const totalMinerPowerRate = ownedMiners.reduce((sum, miner) => {
      const masterMiner = MINER_MASTER_DATA[miner.minerId];
      return sum + (masterMiner ? masterMiner.shardsPerDay * miner.quantity : 0);
    }, 0);

    switch (currentPage) {
      case 'home':
        return (
          <Home
            currentShards={currentShards}
            ownedMiners={ownedMiners.map(miner => ({
              ...miner,
              name: MINER_MASTER_DATA[miner.minerId]?.name || 'Unknown Miner',
              powerRate: MINER_MASTER_DATA[miner.minerId]?.shardsPerDay || 0
            }))}
            activeBoosts={activeBoosts.filter(boost => Date.now() < boost.endTime.toMillis())}
            onGoMineClick={handleGoMineClick}
          />
        );
      case 'mine':
        return (
          <Mine
            minerPowerRate={totalMinerPowerRate}
            shardsToClaim={shardsToClaim}
            onClaimShards={handleClaimShards}
            onGoShopClick={handleGoShopClick}
          />
        );
      case 'gifts':
        return (
          <Gifts
            currentShards={currentShards}
            onExchangeGift={handleExchangeGift}
          />
        );
      case 'tasks':
        return (
          <Tasks
            onCompleteTask={handleCompleteTask}
          />
        );
      case 'admin':
        return (
          <AdminPanel
            userId={userId}
            isAdmin={isAdmin}
            onTriggerGiftDistribution={handleTriggerGiftDistribution}
            onShardReset={handleShardReset}
          />
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="
      relative flex flex-col min-h-screen
      bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100
      max-w-xl mx-auto w-full
    ">
      <div className="flex-grow flex flex-col items-center justify-start p-4 pb-20">
        {renderPage()}
      </div>
      <NavigationBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;