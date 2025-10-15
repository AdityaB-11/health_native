const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc } = require('firebase/firestore');
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function finalCleanup() {
  console.log('🧹 Final cleanup of remaining non-Indian entries...\n');
  
  // Remove Dr. Parth Gosavi from doctors
  const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
  for (const docSnapshot of doctorsSnapshot.docs) {
    const data = docSnapshot.data();
    if (data.name === 'Dr. Parth Gosavi' || data.name === 'Dr. Vikram Singh' && data.id !== 'dPKWH93F5DcnwWrDhGXW') {
      await deleteDoc(doc(db, 'doctors', docSnapshot.id));
      console.log(`🗑️ Deleted doctor: ${data.name} (ID: ${docSnapshot.id})`);
    }
  }
  
  // Remove Parth G from patients  
  const patientsSnapshot = await getDocs(collection(db, 'patients'));
  for (const docSnapshot of patientsSnapshot.docs) {
    const data = docSnapshot.data();
    if (data.name === 'Parth G' || data.name === 'Parth Gosavi') {
      await deleteDoc(doc(db, 'patients', docSnapshot.id));
      console.log(`🗑️ Deleted patient: ${data.name} (ID: ${docSnapshot.id})`);
    }
  }
  
  console.log('\n✅ Final cleanup complete!');
}

finalCleanup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Final cleanup failed:', error);
    process.exit(1);
  });