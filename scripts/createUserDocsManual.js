#!/usr/bin/env node

/**
 * Create User Documents in Firestore (Manual UID Entry)
 * 
 * This script creates user profile documents in Firestore.
 * You'll need to provide the UIDs from Firebase Authentication.
 * 
 * Usage: node scripts/createUserDocsManual.js
 */

require('dotenv').config();
const readline = require('readline');
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { 
  getFirestore, 
  doc,
  setDoc,
  getDocs,
  collection,
  Timestamp 
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? process.env.EXPO_PUBLIC_FIREBASE_API_KEY.replace(/"/g, '') : '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ? process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN.replace(/"/g, '') : '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID.replace(/"/g, '') : '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET.replace(/"/g, '') : '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID.replace(/"/g, '') : '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ? process.env.EXPO_PUBLIC_FIREBASE_APP_ID.replace(/"/g, '') : '',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('✅ Firebase initialized successfully!');
console.log('📦 Project ID:', firebaseConfig.projectId);

// Get Dr. Sarah Johnson's ID
async function getDoctorId() {
  try {
    const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
    const doctors = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const drSarah = doctors.find(d => d.name === 'Dr. Sarah Johnson');
    
    if (drSarah) {
      return drSarah.id;
    }
    
    if (doctors.length > 0) {
      return doctors[0].id;
    }
    
    throw new Error('No doctors found');
  } catch (error) {
    console.error('Error fetching doctor ID:', error);
    throw error;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('👥 User Document Creator');
    console.log('='.repeat(70));
    
    console.log('\n📋 Instructions:');
    console.log('1. Open Firebase Console: https://console.firebase.google.com/project/health-manage01/authentication/users');
    console.log('2. Copy the UID for each user\n');

    const doctorId = await getDoctorId();
    console.log(`✅ Found Doctor ID: ${doctorId} (Dr. Sarah Johnson)\n`);

    // Get UIDs from user
    console.log('Please enter the UIDs from Firebase Authentication:\n');
    
    const adminUid = await question('Admin User (admin@health.com) UID: ');
    const doctorUid = await question('Doctor User (doctor@health.com) UID: ');
    const patientUid = await question('Patient User (patient@health.com) UID: ');

    if (!adminUid.trim() || !doctorUid.trim() || !patientUid.trim()) {
      console.log('\n❌ Error: All UIDs are required!');
      rl.close();
      process.exit(1);
    }

    console.log('\n' + '='.repeat(70));
    console.log('Creating user documents...\n');

    // Create Admin User Document
    console.log('1. Creating Admin user document...');
    await setDoc(doc(db, 'users', adminUid.trim()), {
      uid: adminUid.trim(),
      email: 'admin@health.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: Timestamp.now(),
    });
    console.log('   ✅ Admin user document created\n');

    // Create Doctor User Document
    console.log('2. Creating Doctor user document...');
    await setDoc(doc(db, 'users', doctorUid.trim()), {
      uid: doctorUid.trim(),
      email: 'doctor@health.com',
      name: 'Dr. Sarah Johnson',
      role: 'doctor',
      doctorId: doctorId,
      createdAt: Timestamp.now(),
    });
    console.log(`   ✅ Doctor user document created (linked to doctor: ${doctorId})\n`);

    // Create Patient User Document
    console.log('3. Creating Patient user document...');
    await setDoc(doc(db, 'users', patientUid.trim()), {
      uid: patientUid.trim(),
      email: 'patient@health.com',
      name: 'John Smith',
      role: 'patient',
      createdAt: Timestamp.now(),
    });
    console.log('   ✅ Patient user document created\n');

    console.log('='.repeat(70));
    console.log('\n🎉 Success! All user documents created in Firestore!\n');
    
    console.log('📊 Summary:');
    console.log(`   ✅ Admin:   ${adminUid.trim()}`);
    console.log(`   ✅ Doctor:  ${doctorUid.trim()} → Doctor Profile: ${doctorId}`);
    console.log(`   ✅ Patient: ${patientUid.trim()}\n`);

    console.log('✅ Next Steps:');
    console.log('   1. Verify in Firebase Console → Firestore → users collection');
    console.log('   2. Start your app: npm start');
    console.log('   3. Login with doctor@health.com / password');
    console.log('   4. Explore the doctor portal!\n');

    rl.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    rl.close();
    process.exit(1);
  }
}

main();
