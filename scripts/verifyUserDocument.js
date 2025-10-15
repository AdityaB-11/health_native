#!/usr/bin/env node

/**
 * Verify User Document Script
 * Checks if the patient user document has the correct patientId
 */

require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

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

const PATIENT_UID = 'rzgGDbH5xhVS11vMQQ2eDaSbF9w1'; // From the user creation output

async function verifyUserDocument() {
  console.log('🔍 Verifying User Document');
  console.log('========================');
  console.log(`👤 Patient UID: ${PATIENT_UID}`);
  console.log('');

  try {
    // Get the user document
    const userRef = doc(db, 'users', PATIENT_UID);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('✅ User document found!');
      console.log(`📧 Email: ${userData.email}`);
      console.log(`👤 Name: ${userData.name}`);
      console.log(`🎭 Role: ${userData.role}`);
      console.log(`🆔 Patient ID: ${userData.patientId || 'NOT SET ❌'}`);
      console.log(`🏥 Doctor ID: ${userData.doctorId || 'Not applicable'}`);
      console.log(`📅 Created: ${userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toISOString() : 'Unknown'}`);
      
      if (userData.patientId) {
        console.log('\n✅ SUCCESS: patientId field is properly set!');
        return userData.patientId;
      } else {
        console.log('\n❌ ERROR: patientId field is missing or empty!');
        return null;
      }
    } else {
      console.log('❌ User document not found!');
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching user document:', error);
    return null;
  }
}

// Run the verification
verifyUserDocument().then((patientId) => {
  if (patientId) {
    console.log(`\n🎯 Patient ID found: ${patientId}`);
    console.log('\n📝 Next steps:');
    console.log('   1. User needs to logout and login again for changes to take effect');
    console.log('   2. Or restart the app completely');
    console.log('   3. Then test the lab reports screen');
  } else {
    console.log('\n💡 Recommended action:');
    console.log('   1. Run the createUserDocsManual.js script again');
    console.log('   2. Make sure to use the correct UIDs');
    console.log('   3. Check Firebase Console to verify the data');
  }
  
  console.log('\n✅ Verification completed');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Verification failed:', error);
  process.exit(1);
});