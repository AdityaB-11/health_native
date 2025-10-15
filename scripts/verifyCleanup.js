const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
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

async function verifyCleanup() {
  console.log('🔍 Verifying Firestore cleanup...\n');
  
  const collections = ['doctors', 'patients', 'medicines', 'articles', 'appointments', 'labReports'];
  
  for (const collectionName of collections) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const docs = querySnapshot.docs;
      
      console.log(`📊 ${collectionName.toUpperCase()}: ${docs.length} documents`);
      
      docs.forEach((doc) => {
        const data = doc.data();
        const identifier = data.name || data.title || data.testType || `${data.patientName}-${data.doctorName}`;
        console.log(`  ✅ ${identifier}`);
      });
      
      console.log('');
    } catch (error) {
      console.error(`❌ Error checking ${collectionName}:`, error);
    }
  }
  
  console.log('🎉 Verification complete!');
}

verifyCleanup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });