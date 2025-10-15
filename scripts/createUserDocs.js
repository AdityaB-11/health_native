#!/usr/bin/env node

/**
 * Create User Documents in Firestore
 * 
 * This script creates user profile documents in Firestore for the users
 * you've already created in Firebase Authentication.
 * 
 * Usage: node scripts/createUserDocs.js
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { 
  getFirestore, 
  doc,
  setDoc,
  getDocs,
  collection,
  Timestamp 
} = require('firebase/firestore');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? process.env.EXPO_PUBLIC_FIREBASE_API_KEY.replace(/"/g, '') : '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ? process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN.replace(/"/g, '') : '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID.replace(/"/g, '') : '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET.replace(/"/g, '') : '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID.replace(/"/g, '') : '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ? process.env.EXPO_PUBLIC_FIREBASE_APP_ID.replace(/"/g, '') : '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('✅ Firebase initialized successfully!');
console.log('📦 Project ID:', firebaseConfig.projectId);

// Get Dr. Sarah Johnson's ID (the first doctor)
async function getDoctorId() {
  try {
    const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
    const doctors = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const drSarah = doctors.find(d => d.name === 'Dr. Sarah Johnson');
    
    if (drSarah) {
      console.log(`\n✅ Found Dr. Sarah Johnson - ID: ${drSarah.id}`);
      return drSarah.id;
    }
    
    // Fallback to first doctor if Dr. Sarah not found
    if (doctors.length > 0) {
      console.log(`\n⚠️  Dr. Sarah Johnson not found, using first doctor: ${doctors[0].name} - ID: ${doctors[0].id}`);
      return doctors[0].id;
    }
    
    throw new Error('No doctors found in database');
  } catch (error) {
    console.error('❌ Error fetching doctor ID:', error);
    throw error;
  }
}

async function createUserDocuments() {
  try {
    console.log('\n👥 Creating user documents in Firestore...\n');
    console.log('='.repeat(60));

    // Get the doctor ID first
    const doctorId = await getDoctorId();

    // Define users with their credentials
    const users = [
      {
        email: 'admin@health.com',
        password: 'password',
        name: 'Admin User',
        role: 'admin',
      },
      {
        email: 'doctor@health.com',
        password: 'password',
        name: 'Dr. Sarah Johnson',
        role: 'doctor',
        doctorId: doctorId,
      },
      {
        email: 'patient@health.com',
        password: 'password',
        name: 'John Smith',
        role: 'patient',
      },
    ];

    let successCount = 0;

    for (const userData of users) {
      try {
        console.log(`\nProcessing: ${userData.email}`);
        
        // Sign in to get the UID
        const userCredential = await signInWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        const uid = userCredential.user.uid;
        console.log(`  ✅ Signed in successfully - UID: ${uid}`);

        // Create user document
        const userDoc = {
          uid,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: Timestamp.now(),
        };

        // Add doctorId for doctor role
        if (userData.doctorId) {
          userDoc.doctorId = userData.doctorId;
        }

        // Save to Firestore
        await setDoc(doc(db, 'users', uid), userDoc);
        
        console.log(`  ✅ Created Firestore document`);
        console.log(`     - Name: ${userDoc.name}`);
        console.log(`     - Role: ${userDoc.role}`);
        if (userDoc.doctorId) {
          console.log(`     - Doctor ID: ${userDoc.doctorId}`);
        }
        
        successCount++;

        // Sign out after creating document
        await auth.signOut();

      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          console.error(`  ❌ Wrong password for ${userData.email}`);
          console.error(`     Please make sure the password is: password`);
        } else if (error.code === 'auth/user-not-found') {
          console.error(`  ❌ User not found: ${userData.email}`);
          console.error(`     Please create this user in Firebase Authentication first`);
        } else {
          console.error(`  ❌ Error creating document for ${userData.email}:`, error.message);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ User documents creation complete!`);
    console.log(`   Created: ${successCount}/${users.length} documents\n`);

    if (successCount === users.length) {
      console.log('🎉 All user documents created successfully!\n');
      console.log('📝 Next steps:');
      console.log('  1. Verify in Firebase Console → Firestore → users collection');
      console.log('  2. Start your app: npm start');
      console.log('  3. Login with doctor@health.com / password');
      console.log('  4. Explore the doctor portal!\n');
    } else {
      console.log('⚠️  Some documents failed to create.');
      console.log('   Please check the errors above and try again.\n');
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
console.log('\n🚀 Starting user document creation...\n');
createUserDocuments();
