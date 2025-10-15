const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc, query, where } = require('firebase/firestore');
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

console.log('✅ Firebase initialized successfully!');
console.log('📦 Project ID:', firebaseConfig.projectId);

// Indian doctor names to keep
const indianDoctorNames = [
  'Dr. Rajesh Kumar',
  'Dr. Priya Sharma', 
  'Dr. Amit Patel',
  'Dr. Sunita Reddy',
  'Dr. Vikram Singh',
  'Dr. Meera Iyer'
];

// Indian patient names to keep
const indianPatientNames = [
  'Raj Malhotra',
  'Priya Desai',
  'Arjun Nair'
];

// Indian medicine names to keep
const indianMedicineNames = [
  'Dolo 650',
  'Azithromycin',
  'Telma 40', 
  'Glycomet',
  'Pan 40',
  'Crocin Advance',
  'Cheston Cold',
  'Becosules'
];

// Indian article titles to keep
const indianArticleTitles = [
  'Heart Health in Indian Diet: Balancing Tradition and Wellness',
  'Managing Diabetes: The Indian Context',
  'Skin Care in Indian Climate: Tips for All Seasons',
  'Yoga and Mental Health: Ancient Wisdom for Modern Stress'
];

async function cleanupCollection(collectionName, keepItems, identifierField) {
  console.log(`\n🧹 Cleaning up ${collectionName} collection...`);
  
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const allDocs = querySnapshot.docs;
    
    console.log(`  📊 Found ${allDocs.length} documents in ${collectionName}`);
    
    let keptCount = 0;
    let deletedCount = 0;
    const keptIds = new Set();
    
    for (const docSnapshot of allDocs) {
      const data = docSnapshot.data();
      const identifier = data[identifierField];
      
      // Check if this item should be kept
      const shouldKeep = keepItems.includes(identifier);
      
      // Check for duplicates (same identifier already kept)
      const isDuplicate = keptIds.has(identifier);
      
      if (shouldKeep && !isDuplicate) {
        // Keep this document (first occurrence of Indian data)
        keptIds.add(identifier);
        keptCount++;
        console.log(`  ✅ Keeping: ${identifier} (ID: ${docSnapshot.id})`);
      } else {
        // Delete this document (non-Indian or duplicate)
        await deleteDoc(doc(db, collectionName, docSnapshot.id));
        deletedCount++;
        const reason = !shouldKeep ? 'non-Indian' : 'duplicate';
        console.log(`  🗑️  Deleted: ${identifier} (ID: ${docSnapshot.id}) - ${reason}`);
      }
    }
    
    console.log(`  📊 Summary for ${collectionName}:`);
    console.log(`     ✅ Kept: ${keptCount} documents`);
    console.log(`     🗑️  Deleted: ${deletedCount} documents`);
    
    return { kept: keptCount, deleted: deletedCount };
    
  } catch (error) {
    console.error(`❌ Error cleaning up ${collectionName}:`, error);
    throw error;
  }
}

async function cleanupAppointments() {
  console.log(`\n🧹 Cleaning up appointments collection...`);
  
  try {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    const allDocs = querySnapshot.docs;
    
    console.log(`  📊 Found ${allDocs.length} documents in appointments`);
    
    let keptCount = 0;
    let deletedCount = 0;
    
    for (const docSnapshot of allDocs) {
      const data = docSnapshot.data();
      const doctorName = data.doctorName;
      const patientName = data.patientName;
      
      // Check if both doctor and patient are Indian
      const hasIndianDoctor = indianDoctorNames.includes(doctorName);
      const hasIndianPatient = indianPatientNames.includes(patientName);
      
      if (hasIndianDoctor && hasIndianPatient) {
        // Keep this appointment
        keptCount++;
        console.log(`  ✅ Keeping: ${patientName} with ${doctorName} (ID: ${docSnapshot.id})`);
      } else {
        // Delete this appointment
        await deleteDoc(doc(db, 'appointments', docSnapshot.id));
        deletedCount++;
        console.log(`  🗑️  Deleted: ${patientName} with ${doctorName} (ID: ${docSnapshot.id})`);
      }
    }
    
    console.log(`  📊 Summary for appointments:`);
    console.log(`     ✅ Kept: ${keptCount} documents`);
    console.log(`     🗑️  Deleted: ${deletedCount} documents`);
    
    return { kept: keptCount, deleted: deletedCount };
    
  } catch (error) {
    console.error(`❌ Error cleaning up appointments:`, error);
    throw error;
  }
}

async function cleanupLabReports() {
  console.log(`\n🧹 Cleaning up labReports collection...`);
  
  try {
    const querySnapshot = await getDocs(collection(db, 'labReports'));
    const allDocs = querySnapshot.docs;
    
    console.log(`  📊 Found ${allDocs.length} documents in labReports`);
    
    let keptCount = 0;
    let deletedCount = 0;
    
    for (const docSnapshot of allDocs) {
      const data = docSnapshot.data();
      const patientName = data.patientName;
      
      // Check if patient is Indian
      const hasIndianPatient = indianPatientNames.includes(patientName);
      
      if (hasIndianPatient) {
        // Keep this lab report
        keptCount++;
        console.log(`  ✅ Keeping: ${data.testType} for ${patientName} (ID: ${docSnapshot.id})`);
      } else {
        // Delete this lab report
        await deleteDoc(doc(db, 'labReports', docSnapshot.id));
        deletedCount++;
        console.log(`  🗑️  Deleted: ${data.testType} for ${patientName} (ID: ${docSnapshot.id})`);
      }
    }
    
    console.log(`  📊 Summary for labReports:`);
    console.log(`     ✅ Kept: ${keptCount} documents`);
    console.log(`     🗑️  Deleted: ${deletedCount} documents`);
    
    return { kept: keptCount, deleted: deletedCount };
    
  } catch (error) {
    console.error(`❌ Error cleaning up labReports:`, error);
    throw error;
  }
}

async function cleanupFirestore() {
  console.log('\n🚀 Starting Firestore cleanup...');
  console.log('🎯 Goal: Keep only Indian data and remove duplicates\n');
  
  const results = {
    doctors: { kept: 0, deleted: 0 },
    patients: { kept: 0, deleted: 0 },
    medicines: { kept: 0, deleted: 0 },
    articles: { kept: 0, deleted: 0 },
    appointments: { kept: 0, deleted: 0 },
    labReports: { kept: 0, deleted: 0 }
  };
  
  try {
    // Clean up each collection
    results.doctors = await cleanupCollection('doctors', indianDoctorNames, 'name');
    results.patients = await cleanupCollection('patients', indianPatientNames, 'name');
    results.medicines = await cleanupCollection('medicines', indianMedicineNames, 'name');
    results.articles = await cleanupCollection('articles', indianArticleTitles, 'title');
    results.appointments = await cleanupAppointments();
    results.labReports = await cleanupLabReports();
    
    // Final summary
    console.log('\n============================================================');
    console.log('🎉 Firestore cleanup completed successfully!');
    console.log('============================================================');
    
    let totalKept = 0;
    let totalDeleted = 0;
    
    Object.entries(results).forEach(([collection, stats]) => {
      console.log(`📊 ${collection.toUpperCase()}:`);
      console.log(`   ✅ Kept: ${stats.kept}`);
      console.log(`   🗑️  Deleted: ${stats.deleted}`);
      totalKept += stats.kept;
      totalDeleted += stats.deleted;
    });
    
    console.log('\n📈 OVERALL SUMMARY:');
    console.log(`   ✅ Total documents kept: ${totalKept}`);
    console.log(`   🗑️  Total documents deleted: ${totalDeleted}`);
    console.log(`   📦 Final database size: ${totalKept} documents`);
    
    console.log('\n🇮🇳 Indian data preserved:');
    console.log(`   👨‍⚕️ Doctors: ${results.doctors.kept} (Indian names)`);
    console.log(`   👥 Patients: ${results.patients.kept} (Indian names)`);
    console.log(`   💊 Medicines: ${results.medicines.kept} (Indian brands)`);
    console.log(`   📰 Articles: ${results.articles.kept} (India-oriented topics)`);
    console.log(`   📅 Appointments: ${results.appointments.kept} (Indian doctor-patient pairs)`);
    console.log(`   🔬 Lab Reports: ${results.labReports.kept} (Indian patients)`);
    
    console.log('\n✨ Database is now clean with only Indian data!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run cleanup
cleanupFirestore()
  .then(() => {
    console.log('\n👋 Cleanup script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Cleanup script failed:', error);
    process.exit(1);
  });