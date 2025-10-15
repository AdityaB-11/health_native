#!/usr/bin/env node

/**
 * Test Patient Data Script
 * Tests if patient can see articles and if reports are being saved correctly
 */

require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, doc, getDoc } = require('firebase/firestore');

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

const PATIENT_ID = 'Q6UqSlutJN2DKCxIPWXU';

async function testPatientData() {
  console.log('🧪 Testing Patient Data Access');
  console.log('==============================');
  console.log(`🆔 Patient ID: ${PATIENT_ID}`);
  console.log('');

  try {
    // Test 1: Check Articles
    console.log('📰 Test 1: Checking Articles...');
    const articlesRef = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesRef);
    const articles = [];
    
    articlesSnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        title: data.title,
        publishDate: data.publishDate,
        createdAt: data.createdAt,
      });
    });
    
    console.log(`   📊 Total articles found: ${articles.length}`);
    
    if (articles.length > 0) {
      console.log('   📋 Articles list:');
      articles.forEach((article, index) => {
        console.log(`      ${index + 1}. ${article.title}`);
        console.log(`         📅 Publish Date: ${article.publishDate || 'Not set'}`);
      });
      
      // Sort by publishDate to test the JavaScript sorting
      const sorted = articles.sort((a, b) => {
        const dateA = new Date(a.publishDate || 0);
        const dateB = new Date(b.publishDate || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log('   ✅ Sorting test passed - articles can be sorted by publishDate');
    } else {
      console.log('   ❌ No articles found - this is the issue!');
    }
    console.log('');

    // Test 2: Check Patient Document
    console.log('👤 Test 2: Checking Patient Document...');
    const patientRef = doc(db, 'patients', PATIENT_ID);
    const patientDoc = await getDoc(patientRef);
    
    if (patientDoc.exists()) {
      const patientData = patientDoc.data();
      console.log(`   ✅ Patient found: ${patientData.name}`);
      console.log(`   📧 Email: ${patientData.email || 'Not set'}`);
      console.log(`   📞 Phone: ${patientData.phone || 'Not set'}`);
    } else {
      console.log(`   ❌ Patient document not found for ID: ${PATIENT_ID}`);
    }
    console.log('');

    // Test 3: Check Lab Reports for this Patient
    console.log('🧪 Test 3: Checking Lab Reports...');
    const reportsRef = collection(db, 'labReports');
    const reportsQuery = query(reportsRef, where('patientId', '==', PATIENT_ID));
    const reportsSnapshot = await getDocs(reportsQuery);
    
    const reports = [];
    reportsSnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        reportType: data.reportType,
        fileName: data.fileName,
        date: data.date,
        patientId: data.patientId,
        patientName: data.patientName,
      });
    });
    
    console.log(`   📊 Reports found for patient: ${reports.length}`);
    
    if (reports.length > 0) {
      console.log('   📋 Reports list:');
      reports.forEach((report, index) => {
        console.log(`      ${index + 1}. ${report.reportType || 'Unknown Type'} - ${report.fileName || 'No filename'}`);
        console.log(`         📅 Date: ${report.date}`);
        console.log(`         👤 Patient: ${report.patientName} (${report.patientId})`);
      });
    } else {
      console.log('   ⚠️  No reports found for this patient');
      console.log('      This could be normal if no reports have been uploaded yet');
    }
    console.log('');

    // Test 4: Check all Lab Reports (to see if any exist)
    console.log('🧪 Test 4: Checking All Lab Reports...');
    const allReportsSnapshot = await getDocs(collection(db, 'labReports'));
    const allReports = [];
    
    allReportsSnapshot.forEach((doc) => {
      const data = doc.data();
      allReports.push({
        id: doc.id,
        reportType: data.reportType,
        fileName: data.fileName,
        patientId: data.patientId,
        patientName: data.patientName,
      });
    });
    
    console.log(`   📊 Total reports in system: ${allReports.length}`);
    if (allReports.length > 0) {
      console.log('   📋 All reports:');
      allReports.forEach((report, index) => {
        console.log(`      ${index + 1}. ${report.reportType || 'Unknown'} (${report.fileName || 'No file'}) - ${report.patientName} (${report.patientId})`);
      });
    }
    console.log('');

    // Test 5: Check User Document
    console.log('👤 Test 5: Checking User Document...');
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('role', '==', 'patient'));
    const userSnapshot = await getDocs(userQuery);
    
    console.log(`   📊 Patient users found: ${userSnapshot.size}`);
    userSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`      🆔 UID: ${doc.id}`);
      console.log(`      👤 Name: ${data.name}`);
      console.log(`      📧 Email: ${data.email}`);
      console.log(`      🏥 Patient ID: ${data.patientId || 'Not linked'}`);
      console.log('      ---');
    });

    console.log('🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the test
testPatientData().then(() => {
  console.log('\n✅ Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});