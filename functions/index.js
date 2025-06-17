const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Gift distribution function
exports.triggerGiftDistribution = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in.');
  }

  const adminDoc = await admin.firestore().doc(`admins/${context.auth.uid}`).get();
  if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required.');
  }

  try {
    const usersRef = admin.firestore().collection('users');
    const usersSnapshot = await usersRef.get();
    const batch = admin.firestore().batch();

    usersSnapshot.forEach((userDoc) => {
      const userRef = usersRef.doc(userDoc.id);
      batch.update(userRef, {
        shards: admin.firestore.FieldValue.increment(100),
      });
    });

    await batch.commit();
    return { success: true, message: 'Gift distribution completed.' };
  } catch (error) {
    functions.logger.error('Error in triggerGiftDistribution:', error); // Updated
    throw new functions.https.HttpsError('internal', 'Failed to distribute gifts.');
  }
});

// Shard reset function
exports.shardReset = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in.');
  }

  const adminDoc = await admin.firestore().doc(`admins/${context.auth.uid}`).get();
  if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required.');
  }

  try {
    const usersRef = admin.firestore().collection('users');
    const usersSnapshot = await usersRef.get();
    const batch = admin.firestore().batch();

    usersSnapshot.forEach((userDoc) => {
      const userRef = usersRef.doc(userDoc.id);
      batch.update(userRef, {
        shards: 0,
        lastClaimTime: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    return { success: true, message: 'All shards reset successfully.' };
  } catch (error) {
    functions.logger.error('Error in shardReset:', error); // Updated
    throw new functions.https.HttpsError('internal', 'Failed to reset shards.');
  }
});