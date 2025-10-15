/**
 * Firebase Initialization Script
 * 
 * This script initializes your Firebase project with:
 * - Firestore collections (doctors, medicines, articles, patients, labReports)
 * - Sample data for each collection
 * - Storage buckets setup
 * 
 * Run this once after setting up your Firebase project
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  Timestamp,
  setDoc,
  doc 
} from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';

// Firebase configuration from environment variables
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log('✅ Firebase initialized successfully!');
console.log('📦 Project ID:', firebaseConfig.projectId);

// Sample data for initialization
const sampleDoctors = [
  {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    hospital: "City General Hospital",
    location: "New York, NY",
    rating: 4.8,
    experience: 15,
    consultationFee: 200,
    available: true,
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@cityhospital.com",
    createdAt: Timestamp.now(),
  },
  {
    name: "Dr. Michael Chen",
    specialization: "Pediatrician",
    hospital: "Children's Medical Center",
    location: "Los Angeles, CA",
    rating: 4.9,
    experience: 12,
    consultationFee: 150,
    available: true,
    phone: "+1 (555) 234-5678",
    email: "michael.chen@childrenmed.com",
    createdAt: Timestamp.now(),
  },
  {
    name: "Dr. Emily Rodriguez",
    specialization: "Dermatologist",
    hospital: "Skin & Wellness Clinic",
    location: "Miami, FL",
    rating: 4.7,
    experience: 10,
    consultationFee: 180,
    available: true,
    phone: "+1 (555) 345-6789",
    email: "emily.rodriguez@skinwellness.com",
    createdAt: Timestamp.now(),
  },
  {
    name: "Dr. James Wilson",
    specialization: "Orthopedic Surgeon",
    hospital: "Sports Medicine Institute",
    location: "Chicago, IL",
    rating: 4.9,
    experience: 20,
    consultationFee: 250,
    available: true,
    phone: "+1 (555) 456-7890",
    email: "james.wilson@sportsmed.com",
    createdAt: Timestamp.now(),
  },
  {
    name: "Dr. Priya Patel",
    specialization: "Neurologist",
    hospital: "Brain & Spine Center",
    location: "Houston, TX",
    rating: 4.8,
    experience: 18,
    consultationFee: 220,
    available: true,
    phone: "+1 (555) 567-8901",
    email: "priya.patel@brainspine.com",
    createdAt: Timestamp.now(),
  },
];

const sampleMedicines = [
  {
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    manufacturer: "PharmaCorp",
    category: "Pain Relief",
    dosageForm: "Tablet",
    strength: "500mg",
    price: 10.99,
    inStock: true,
    prescriptionRequired: false,
    description: "Used for pain relief, fever reduction, and inflammation",
    createdAt: Timestamp.now(),
  },
  {
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    manufacturer: "MediPharm",
    category: "Antibiotic",
    dosageForm: "Capsule",
    strength: "250mg",
    price: 25.50,
    inStock: true,
    prescriptionRequired: true,
    description: "Antibiotic used to treat bacterial infections",
    createdAt: Timestamp.now(),
  },
  {
    name: "Lisinopril",
    genericName: "Lisinopril",
    manufacturer: "CardioMed",
    category: "Blood Pressure",
    dosageForm: "Tablet",
    strength: "10mg",
    price: 18.75,
    inStock: true,
    prescriptionRequired: true,
    description: "ACE inhibitor for high blood pressure and heart failure",
    createdAt: Timestamp.now(),
  },
  {
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    manufacturer: "DiabetesCare",
    category: "Diabetes",
    dosageForm: "Tablet",
    strength: "850mg",
    price: 22.00,
    inStock: true,
    prescriptionRequired: true,
    description: "Oral diabetes medicine for type 2 diabetes",
    createdAt: Timestamp.now(),
  },
  {
    name: "Omeprazole",
    genericName: "Omeprazole",
    manufacturer: "GastroPharma",
    category: "Digestive",
    dosageForm: "Capsule",
    strength: "20mg",
    price: 15.99,
    inStock: true,
    prescriptionRequired: false,
    description: "Proton pump inhibitor for acid reflux and heartburn",
    createdAt: Timestamp.now(),
  },
  {
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    manufacturer: "PainRelief Inc",
    category: "Pain Relief",
    dosageForm: "Tablet",
    strength: "400mg",
    price: 12.50,
    inStock: true,
    prescriptionRequired: false,
    description: "NSAID for pain, fever, and inflammation",
    createdAt: Timestamp.now(),
  },
];

const sampleArticles = [
  {
    title: "10 Tips for a Healthy Heart",
    content: "Maintaining heart health is crucial for overall well-being. Here are 10 evidence-based tips: 1) Exercise regularly - aim for 30 minutes daily, 2) Eat a balanced diet rich in fruits and vegetables, 3) Manage stress through meditation or yoga, 4) Get adequate sleep (7-8 hours), 5) Avoid smoking and limit alcohol, 6) Monitor blood pressure regularly, 7) Maintain healthy weight, 8) Reduce sodium intake, 9) Stay hydrated, 10) Regular check-ups with your cardiologist.",
    category: "Cardiology",
    author: "Dr. Sarah Johnson",
    readTime: 5,
    tags: ["heart", "health", "prevention", "cardiology"],
    publishedDate: Timestamp.now(),
    createdAt: Timestamp.now(),
  },
  {
    title: "Understanding Diabetes: Prevention and Management",
    content: "Diabetes is a chronic condition affecting millions worldwide. Type 2 diabetes can often be prevented through lifestyle changes. Key strategies include maintaining healthy weight, regular physical activity, eating whole grains and fiber-rich foods, limiting sugar and refined carbs, and regular health screenings. For those with diabetes, proper management includes monitoring blood sugar, taking medications as prescribed, healthy eating, regular exercise, and stress management.",
    category: "Endocrinology",
    author: "Dr. Michael Chen",
    readTime: 7,
    tags: ["diabetes", "prevention", "lifestyle", "nutrition"],
    publishedDate: Timestamp.now(),
    createdAt: Timestamp.now(),
  },
  {
    title: "Skin Care Essentials: Protecting Your Largest Organ",
    content: "Your skin is your body's largest organ and deserves proper care. Essential skin care tips: 1) Use sunscreen daily (SPF 30+), 2) Cleanse gently twice daily, 3) Moisturize regularly, 4) Stay hydrated, 5) Eat antioxidant-rich foods, 6) Get adequate sleep, 7) Manage stress, 8) Avoid smoking, 9) Limit hot water exposure, 10) See a dermatologist annually for skin checks.",
    category: "Dermatology",
    author: "Dr. Emily Rodriguez",
    readTime: 6,
    tags: ["skincare", "dermatology", "prevention", "beauty"],
    publishedDate: Timestamp.now(),
    createdAt: Timestamp.now(),
  },
  {
    title: "Exercise and Bone Health: Building Strong Foundations",
    content: "Strong bones are essential for mobility and quality of life. Weight-bearing exercises like walking, jogging, and strength training help build and maintain bone density. Combine exercise with adequate calcium (1000-1200mg daily) and vitamin D intake. Avoid smoking and excessive alcohol. Regular bone density screenings are important, especially for those over 50 or with risk factors for osteoporosis.",
    category: "Orthopedics",
    author: "Dr. James Wilson",
    readTime: 5,
    tags: ["bones", "exercise", "orthopedics", "prevention"],
    publishedDate: Timestamp.now(),
    createdAt: Timestamp.now(),
  },
  {
    title: "Brain Health: Keeping Your Mind Sharp",
    content: "Maintaining cognitive health is vital at every age. Research shows that regular mental stimulation, physical exercise, social engagement, quality sleep, stress management, and a Mediterranean-style diet can help preserve brain function. Stay mentally active with puzzles, reading, learning new skills. Exercise increases blood flow to the brain. Social connections and managing conditions like high blood pressure and diabetes also protect brain health.",
    category: "Neurology",
    author: "Dr. Priya Patel",
    readTime: 8,
    tags: ["brain", "cognitive", "neurology", "mental-health"],
    publishedDate: Timestamp.now(),
    createdAt: Timestamp.now(),
  },
];

const samplePatients = [
  {
    name: "John Doe",
    age: 45,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+1 (555) 111-2222",
    email: "john.doe@email.com",
    address: "123 Main St, New York, NY 10001",
    medicalHistory: "Hypertension, Type 2 Diabetes",
    createdAt: Timestamp.now(),
  },
  {
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    bloodGroup: "O-",
    phone: "+1 (555) 222-3333",
    email: "jane.smith@email.com",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    medicalHistory: "Asthma",
    createdAt: Timestamp.now(),
  },
  {
    name: "Robert Brown",
    age: 58,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+1 (555) 333-4444",
    email: "robert.brown@email.com",
    address: "789 Pine Rd, Chicago, IL 60601",
    medicalHistory: "Arthritis, High Cholesterol",
    createdAt: Timestamp.now(),
  },
];

const sampleLabReports = [
  {
    patientId: "will-be-set-later",
    patientName: "John Doe",
    testType: "Blood Sugar Test",
    date: Timestamp.now(),
    status: "completed",
    results: {
      fastingGlucose: "126 mg/dL",
      hba1c: "6.8%",
      status: "Pre-diabetic range"
    },
    notes: "Patient should monitor diet and exercise. Follow-up in 3 months.",
    createdAt: Timestamp.now(),
  },
  {
    patientId: "will-be-set-later",
    patientName: "Jane Smith",
    testType: "Complete Blood Count",
    date: Timestamp.now(),
    status: "completed",
    results: {
      wbc: "7.5 K/uL",
      rbc: "4.8 M/uL",
      hemoglobin: "14.2 g/dL",
      platelets: "250 K/uL",
      status: "Normal"
    },
    notes: "All values within normal range.",
    createdAt: Timestamp.now(),
  },
  {
    patientId: "will-be-set-later",
    patientName: "Robert Brown",
    testType: "Lipid Panel",
    date: Timestamp.now(),
    status: "completed",
    results: {
      totalCholesterol: "220 mg/dL",
      ldl: "140 mg/dL",
      hdl: "45 mg/dL",
      triglycerides: "175 mg/dL",
      status: "Borderline High"
    },
    notes: "Recommend lifestyle modifications and possible statin therapy.",
    createdAt: Timestamp.now(),
  },
];

/**
 * Initialize Firestore collections with sample data
 */
export async function initializeFirestore() {
  console.log('\n🔄 Initializing Firestore collections...\n');

  try {
    // Create Doctors collection
    console.log('📋 Creating doctors collection...');
    for (const doctor of sampleDoctors) {
      const docRef = await addDoc(collection(db, 'doctors'), doctor);
      console.log(`  ✅ Added doctor: ${doctor.name} (ID: ${docRef.id})`);
    }

    // Create Medicines collection
    console.log('\n💊 Creating medicines collection...');
    for (const medicine of sampleMedicines) {
      const docRef = await addDoc(collection(db, 'medicines'), medicine);
      console.log(`  ✅ Added medicine: ${medicine.name} (ID: ${docRef.id})`);
    }

    // Create Articles collection
    console.log('\n📰 Creating articles collection...');
    for (const article of sampleArticles) {
      const docRef = await addDoc(collection(db, 'articles'), article);
      console.log(`  ✅ Added article: ${article.title} (ID: ${docRef.id})`);
    }

    // Create Patients collection
    console.log('\n👥 Creating patients collection...');
    const patientIds: string[] = [];
    for (const patient of samplePatients) {
      const docRef = await addDoc(collection(db, 'patients'), patient);
      patientIds.push(docRef.id);
      console.log(`  ✅ Added patient: ${patient.name} (ID: ${docRef.id})`);
    }

    // Create Lab Reports collection
    console.log('\n🔬 Creating labReports collection...');
    for (let i = 0; i < sampleLabReports.length; i++) {
      const report = { ...sampleLabReports[i], patientId: patientIds[i] };
      const docRef = await addDoc(collection(db, 'labReports'), report);
      console.log(`  ✅ Added lab report: ${report.testType} for ${report.patientName} (ID: ${docRef.id})`);
    }

    console.log('\n✅ Firestore initialization complete!');
    console.log('\n📊 Summary:');
    console.log(`  - Doctors: ${sampleDoctors.length} added`);
    console.log(`  - Medicines: ${sampleMedicines.length} added`);
    console.log(`  - Articles: ${sampleArticles.length} added`);
    console.log(`  - Patients: ${samplePatients.length} added`);
    console.log(`  - Lab Reports: ${sampleLabReports.length} added`);

  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
    throw error;
  }
}

/**
 * Initialize Storage buckets
 */
export async function initializeStorage() {
  console.log('\n🔄 Initializing Firebase Storage...\n');

  try {
    // Create reference to storage folders
    const labReportsRef = ref(storage, 'lab-reports/');
    const articlesRef = ref(storage, 'articles/');
    const profilesRef = ref(storage, 'profiles/');

    console.log('📁 Storage folder structure:');
    console.log('  - lab-reports/ (for patient lab report PDFs)');
    console.log('  - articles/ (for article images)');
    console.log('  - profiles/ (for user profile pictures)');

    console.log('\n✅ Storage initialization complete!');
    console.log('ℹ️  Folders will be created automatically when you upload files.');

  } catch (error) {
    console.error('❌ Error initializing Storage:', error);
    throw error;
  }
}

/**
 * Main initialization function
 */
export async function initializeFirebase() {
  console.log('🚀 Starting Firebase initialization...\n');
  console.log('=' .repeat(60));

  try {
    await initializeFirestore();
    await initializeStorage();

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Firebase initialization completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Go to Firebase Console to verify data');
    console.log('  2. Update Firestore Security Rules (see FIREBASE_SETUP_GUIDE.md)');
    console.log('  3. Update Storage Security Rules');
    console.log('  4. Create admin user (see FIREBASE_QUICK_START.md)');
    console.log('  5. Test your app!');
    console.log('\n🔗 Firebase Console: https://console.firebase.google.com/');

  } catch (error) {
    console.error('\n❌ Firebase initialization failed:', error);
    process.exit(1);
  }
}

// Export for use in other files
export { app, auth, db, storage };
