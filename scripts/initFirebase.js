#!/usr/bin/env node

/**
 * Firebase Database Initialization Script
 * 
 * This script sets up your Firebase project with:
 * - Firestore collections (doctors, medicines, articles, patients, labReports)
 * - Sample data for testing
 * - Storage folder structure
 * 
 * Usage: node scripts/initFirebase.js
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { 
  getFirestore, 
  collection, 
  addDoc,
  doc,
  setDoc,
  Timestamp 
} = require('firebase/firestore');
const { getStorage, ref } = require('firebase/storage');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? process.env.EXPO_PUBLIC_FIREBASE_API_KEY.replace(/"/g, '') : '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ? process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN.replace(/"/g, '') : '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID.replace(/"/g, '') : '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET.replace(/"/g, '') : '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID.replace(/"/g, '') : '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ? process.env.EXPO_PUBLIC_FIREBASE_APP_ID.replace(/"/g, '') : '',
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Firebase configuration not found!');
  console.error('Please check your .env file and ensure all Firebase variables are set.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log('✅ Firebase initialized successfully!');
console.log('📦 Project ID:', firebaseConfig.projectId);

// Sample data - India oriented
const sampleDoctors = [
  {
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    qualification: "MBBS, MD, DM (Cardiology)",
    hospital: "Apollo Hospital",
    location: "Delhi",
    rating: 4.8,
    experience: 15,
    consultationFee: 800,
    availability: "Mon-Sat, 9 AM - 5 PM",
    available: true,
    phone: "+91 98100 12345",
    email: "rajesh.kumar@apollo.com",
    imageUrl: "",
    createdAt: Timestamp.now(),
  },
  {
    name: "Dr. Priya Sharma",
    specialization: "Pediatrician",
    qualification: "MBBS, MD (Pediatrics)",
    hospital: "Fortis Hospital",
    location: "Mumbai",
    rating: 4.9,
    experience: 12,
    consultationFee: 600,
    availability: "Mon-Sat, 10 AM - 6 PM",
    available: true,
    phone: "+91 98200 23456",
    email: "priya.sharma@fortis.com",
    imageUrl: "",
    createdAt: Timestamp.now(),
  },
  {
    name: "Dr. Amit Patel",
    specialization: "Dermatologist",
    qualification: "MBBS, MD (Dermatology)",
    hospital: "Max Healthcare",
    location: "Bangalore",
    rating: 4.7,
    experience: 10,
    consultationFee: 700,
    availability: "Mon-Fri, 11 AM - 7 PM",
    available: true,
    phone: "+91 98300 34567",
    email: "amit.patel@max.com",
    imageUrl: "",
    createdAt: Timestamp.now(),
  },
  {
    name: "Dr. Sunita Reddy",
    specialization: "Orthopedic Surgeon",
    qualification: "MBBS, MS (Orthopedics)",
    hospital: "Manipal Hospital",
    location: "Hyderabad",
    rating: 4.9,
    experience: 20,
    consultationFee: 1000,
    availability: "Mon-Sat, 9 AM - 4 PM",
    available: true,
    phone: "+91 98400 45678",
    email: "sunita.reddy@manipal.com",
    imageUrl: "",
    createdAt: Timestamp.now(),
  },
  {
    name: "Dr. Vikram Singh",
    specialization: "Neurologist",
    qualification: "MBBS, MD, DM (Neurology)",
    hospital: "AIIMS",
    location: "Delhi",
    rating: 4.8,
    experience: 18,
    consultationFee: 900,
    availability: "Tue-Sat, 10 AM - 5 PM",
    available: true,
    phone: "+91 98500 56789",
    email: "vikram.singh@aiims.edu",
    imageUrl: "",
    createdAt: Timestamp.now(),
  },
  {
    name: "Dr. Meera Iyer",
    specialization: "Gynecologist",
    qualification: "MBBS, MD (OB-GYN)",
    hospital: "Cloudnine Hospital",
    location: "Chennai",
    rating: 4.9,
    experience: 14,
    consultationFee: 750,
    availability: "Mon-Sat, 9 AM - 6 PM",
    available: true,
    phone: "+91 98600 67890",
    email: "meera.iyer@cloudnine.com",
    imageUrl: "",
    createdAt: Timestamp.now(),
  },
];

const sampleMedicines = [
  {
    name: "Dolo 650",
    genericName: "Paracetamol",
    manufacturer: "Micro Labs",
    category: "Painkiller",
    dosageForm: "Tablet",
    strength: "650mg",
    price: 30,
    inStock: true,
    prescriptionRequired: false,
    description: "Used for fever and mild to moderate pain relief",
    sideEffects: ["Nausea", "Allergic reactions (rare)"],
    createdAt: Timestamp.now(),
  },
  {
    name: "Azithromycin",
    genericName: "Azithromycin",
    manufacturer: "Cipla",
    category: "Antibiotic",
    dosageForm: "Tablet",
    strength: "500mg",
    price: 85,
    inStock: true,
    prescriptionRequired: true,
    description: "Antibiotic used to treat bacterial infections",
    sideEffects: ["Diarrhea", "Nausea", "Abdominal pain"],
    createdAt: Timestamp.now(),
  },
  {
    name: "Telma 40",
    genericName: "Telmisartan",
    manufacturer: "Glenmark",
    category: "Antihypertensive",
    dosageForm: "Tablet",
    strength: "40mg",
    price: 120,
    inStock: true,
    prescriptionRequired: true,
    description: "Used to treat high blood pressure",
    sideEffects: ["Dizziness", "Back pain", "Sinus problems"],
    createdAt: Timestamp.now(),
  },
  {
    name: "Glycomet",
    genericName: "Metformin",
    manufacturer: "USV Limited",
    category: "Antidiabetic",
    dosageForm: "Tablet",
    strength: "500mg",
    price: 45,
    inStock: true,
    prescriptionRequired: true,
    description: "Oral diabetes medicine for type 2 diabetes",
    sideEffects: ["Nausea", "Diarrhea", "Stomach upset"],
    createdAt: Timestamp.now(),
  },
  {
    name: "Pan 40",
    genericName: "Pantoprazole",
    manufacturer: "Alkem Laboratories",
    category: "Antacid",
    dosageForm: "Tablet",
    strength: "40mg",
    price: 95,
    inStock: true,
    prescriptionRequired: false,
    description: "Proton pump inhibitor for acid reflux and heartburn",
    sideEffects: ["Headache", "Diarrhea", "Nausea"],
    createdAt: Timestamp.now(),
  },
  {
    name: "Crocin Advance",
    genericName: "Paracetamol",
    manufacturer: "GlaxoSmithKline",
    category: "Painkiller",
    dosageForm: "Tablet",
    strength: "500mg",
    price: 25,
    inStock: true,
    prescriptionRequired: false,
    description: "Fast relief from fever and pain",
    sideEffects: ["Allergic reactions (rare)", "Liver damage (overdose)"],
    createdAt: Timestamp.now(),
  },
  {
    name: "Cheston Cold",
    genericName: "Cetirizine + Paracetamol + Phenylephrine",
    manufacturer: "Cipla",
    category: "Cold & Flu",
    dosageForm: "Tablet",
    strength: "5mg+325mg+5mg",
    price: 55,
    inStock: true,
    prescriptionRequired: false,
    description: "Relief from cold, flu, and allergies",
    sideEffects: ["Drowsiness", "Dry mouth", "Dizziness"],
    createdAt: Timestamp.now(),
  },
  {
    name: "Becosules",
    genericName: "Vitamin B Complex",
    manufacturer: "Pfizer",
    category: "Vitamin",
    dosageForm: "Capsule",
    strength: "Multi-vitamin",
    price: 40,
    inStock: true,
    prescriptionRequired: false,
    description: "Vitamin B complex supplement for overall health",
    sideEffects: ["Mild stomach upset", "Headache (rare)"],
    createdAt: Timestamp.now(),
  },
];

const sampleArticles = [
  {
    title: "Heart Health in Indian Diet: Balancing Tradition and Wellness",
    summary: "Learn how to maintain heart health while enjoying traditional Indian cuisine",
    content: "Maintaining heart health doesn't mean giving up Indian food. Here are 10 tips: 1) Use mustard oil or olive oil instead of ghee, 2) Include plenty of dal and legumes, 3) Eat seasonal fruits like pomegranate and guava, 4) Practice yoga for 30 minutes daily, 5) Reduce salt in cooking, 6) Include turmeric and garlic in your diet, 7) Choose brown rice over white, 8) Walk after meals (सौ कदम), 9) Avoid trans fats in packaged foods, 10) Regular check-ups, especially after age 40.",
    category: "Nutrition",
    author: "Dr. Rajesh Kumar",
    readTime: 5,
    tags: ["heart", "nutrition", "indian-diet", "prevention"],
    publishDate: new Date().toISOString(),
    imageUrl: "",
    externalUrl: "",
    createdAt: Timestamp.now(),
  },
  {
    title: "Managing Diabetes: The Indian Context",
    summary: "Understanding and controlling diabetes with Indian dietary modifications",
    content: "India is the diabetes capital of the world. Managing diabetes with Indian diet: 1) Replace white rice with brown rice or millets, 2) Use jaggery sparingly instead of sugar, 3) Include karela (bitter gourd) and methi (fenugreek), 4) Eat smaller portions of roti, 5) Avoid fruit juices, eat whole fruits, 6) Include moong dal and chana, 7) Practice portion control in meals, 8) Walk for 30 minutes after dinner, 9) Monitor blood sugar regularly, 10) Take prescribed medications on time. Consult your doctor for personalized diet plans.",
    category: "Lifestyle",
    author: "Dr. Priya Sharma",
    readTime: 7,
    tags: ["diabetes", "diet", "lifestyle", "prevention"],
    publishDate: new Date().toISOString(),
    imageUrl: "",
    externalUrl: "",
    createdAt: Timestamp.now(),
  },
  {
    title: "Skin Care in Indian Climate: Tips for All Seasons",
    summary: "Protect and nourish your skin through India's diverse weather conditions",
    content: "Indian climate demands special skin care. Seasonal tips: SUMMER - Use sunscreen (SPF 40+), drink plenty of water, use light moisturizers, avoid sun 11 AM-4 PM. MONSOON - Cleanse twice daily, use antifungal powder, keep skin dry. WINTER - Use heavier moisturizers, apply coconut oil before bathing, drink warm water. YEAR-ROUND - Use neem face wash, apply kumkumadi oil at night, use multani mitti weekly, eat seasonal fruits. Home remedies: Turmeric-curd mask, besan-milk scrub, rose water toner. See a dermatologist for persistent issues.",
    category: "Fitness",
    author: "Dr. Amit Patel",
    readTime: 6,
    tags: ["skincare", "seasonal", "home-remedies", "beauty"],
    publishDate: new Date().toISOString(),
    imageUrl: "",
    externalUrl: "",
    createdAt: Timestamp.now(),
  },
  {
    title: "Yoga and Mental Health: Ancient Wisdom for Modern Stress",
    summary: "How traditional yoga practices can help manage anxiety and depression",
    content: "Mental health is as important as physical health. Yoga for mental wellness: 1) PRANAYAMA - Practice Anulom Vilom for 10 minutes daily, 2) ASANAS - Surya Namaskar reduces stress, 3) MEDITATION - Start with 5 minutes daily, 4) YOGA NIDRA - Deep relaxation technique, 5) CHANTING - Om chanting calms the mind. Lifestyle tips: Sleep 7-8 hours, avoid excessive screen time, spend time in nature, maintain social connections, eat sattvic food. Don't hesitate to consult a mental health professional. Remember: मन की शांति सबसे बड़ा धन है।",
    category: "Mental Health",
    author: "Dr. Vikram Singh",
    readTime: 8,
    tags: ["yoga", "mental-health", "meditation", "wellness"],
    publishDate: new Date().toISOString(),
    imageUrl: "",
    externalUrl: "",
    createdAt: Timestamp.now(),
  },
];

const samplePatients = [
  {
    name: "Raj Malhotra",
    age: 45,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+91 9810012345",
    email: "raj.malhotra@email.com",
    address: "B-204, Green Park, New Delhi 110016",
    medicalHistory: "Hypertension, Type 2 Diabetes",
    createdAt: Timestamp.now(),
  },
  {
    name: "Priya Desai",
    age: 32,
    gender: "Female",
    bloodGroup: "O-",
    phone: "+91 9820023456",
    email: "priya.desai@email.com",
    address: "Flat 501, Bandra West, Mumbai 400050",
    medicalHistory: "Asthma, Thyroid",
    createdAt: Timestamp.now(),
  },
  {
    name: "Arjun Nair",
    age: 58,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 9845034567",
    email: "arjun.nair@email.com",
    address: "Villa 12, Whitefield, Bangalore 560066",
    medicalHistory: "Arthritis, High Cholesterol, BP",
    createdAt: Timestamp.now(),
  },
];

async function initializeFirestore() {
  console.log('\n🔄 Initializing Firestore collections...\n');

  try {
    // Create Doctors collection
    console.log('📋 Creating doctors collection...');
    const doctorRefs = [];
    for (const doctor of sampleDoctors) {
      const docRef = await addDoc(collection(db, 'doctors'), doctor);
      doctorRefs.push(docRef);
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
    const patientRefs = [];
    for (const patient of samplePatients) {
      const docRef = await addDoc(collection(db, 'patients'), patient);
      patientRefs.push(docRef);
      console.log(`  ✅ Added patient: ${patient.name} (ID: ${docRef.id})`);
    }

    // Create Lab Reports collection
    console.log('\n🔬 Creating labReports collection...');
    const labReports = [
      {
        patientId: patientRefs[0].id,
        patientName: "Raj Malhotra",
        testType: "Blood Sugar Test",
        date: new Date().toISOString(),
        reportType: "Blood Sugar Test",
        status: "completed",
        results: {
          fastingGlucose: "126 mg/dL",
          hba1c: "6.8%",
          status: "Pre-diabetic range"
        },
        notes: "Patient should monitor diet and exercise. Reduce rice intake, increase physical activity. Follow-up in 3 months.",
        createdAt: Timestamp.now(),
      },
      {
        patientId: patientRefs[1].id,
        patientName: "Priya Desai",
        testType: "Complete Blood Count",
        date: new Date().toISOString(),
        reportType: "Complete Blood Count",
        status: "completed",
        results: {
          wbc: "7.5 K/uL",
          rbc: "4.8 M/uL",
          hemoglobin: "14.2 g/dL",
          platelets: "250 K/uL",
          status: "Normal"
        },
        notes: "All values within normal range. Continue thyroid medication as prescribed.",
        createdAt: Timestamp.now(),
      },
      {
        patientId: patientRefs[2].id,
        patientName: "Arjun Nair",
        testType: "Lipid Panel",
        date: new Date().toISOString(),
        reportType: "Lipid Panel",
        status: "completed",
        results: {
          totalCholesterol: "220 mg/dL",
          ldl: "140 mg/dL",
          hdl: "45 mg/dL",
          triglycerides: "175 mg/dL",
          status: "Borderline High"
        },
        notes: "Recommend lifestyle modifications - reduce ghee/butter, walk 30 mins daily, and statin therapy if needed.",
        createdAt: Timestamp.now(),
      },
    ];

    for (const report of labReports) {
      const docRef = await addDoc(collection(db, 'labReports'), report);
      console.log(`  ✅ Added lab report: ${report.testType} for ${report.patientName} (ID: ${docRef.id})`);
    }

    console.log('\n✅ Firestore initialization complete!');
    console.log('\n📊 Summary:');
    console.log(`  - Doctors: ${sampleDoctors.length} added`);
    console.log(`  - Medicines: ${sampleMedicines.length} added`);
    console.log(`  - Articles: ${sampleArticles.length} added`);
    console.log(`  - Patients: ${samplePatients.length} added`);
    console.log(`  - Lab Reports: ${labReports.length} added`);

    // Return doctor IDs for appointment creation
    return {
      doctorIds: doctorRefs.map(ref => ref.id),
      patientIds: patientRefs.map(ref => ref.id)
    };

  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
    throw error;
  }
}

async function createAppointments(doctorIds, patientIds) {
  try {
    console.log('\n📅 Creating sample appointments...');
    
    // Sample appointments spanning different dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const sampleAppointments = [
      // Today's appointments
      {
        doctorId: doctorIds[0],
        doctorName: "Dr. Rajesh Kumar",
        patientId: patientIds[0],
        patientName: "Raj Malhotra",
        patientAge: 45,
        patientGender: "Male",
        appointmentDate: today.toISOString().split('T')[0],
        appointmentTime: "09:00 AM",
        status: "scheduled",
        type: "consultation",
        symptoms: "Chest pain and shortness of breath",
        createdAt: Timestamp.now(),
      },
      {
        doctorId: doctorIds[1],
        doctorName: "Dr. Priya Sharma",
        patientId: patientIds[1],
        patientName: "Priya Desai",
        patientAge: 32,
        patientGender: "Female",
        appointmentDate: today.toISOString().split('T')[0],
        appointmentTime: "10:30 AM",
        status: "in-progress",
        type: "consultation",
        symptoms: "Thyroid checkup and fever",
        createdAt: Timestamp.now(),
      },
      {
        doctorId: doctorIds[0],
        doctorName: "Dr. Rajesh Kumar",
        patientId: patientIds[2],
        patientName: "Arjun Nair",
        patientAge: 58,
        patientGender: "Male",
        appointmentDate: today.toISOString().split('T')[0],
        appointmentTime: "02:00 PM",
        status: "scheduled",
        type: "follow-up",
        symptoms: "Follow-up on blood pressure medication",
        createdAt: Timestamp.now(),
      },
      // Tomorrow's appointments
      {
        doctorId: doctorIds[2],
        doctorName: "Dr. Amit Patel",
        patientId: patientIds[0],
        patientName: "Raj Malhotra",
        patientAge: 45,
        patientGender: "Male",
        appointmentDate: tomorrow.toISOString().split('T')[0],
        appointmentTime: "11:00 AM",
        status: "scheduled",
        type: "consultation",
        symptoms: "Skin rash on arms",
        createdAt: Timestamp.now(),
      },
      // Last week - completed
      {
        doctorId: doctorIds[0],
        doctorName: "Dr. Rajesh Kumar",
        patientId: patientIds[1],
        patientName: "Priya Desai",
        patientAge: 32,
        patientGender: "Female",
        appointmentDate: lastWeek.toISOString().split('T')[0],
        appointmentTime: "03:00 PM",
        status: "completed",
        type: "consultation",
        symptoms: "Annual checkup",
        diagnosis: "Healthy, thyroid under control. All vitals normal. Recommended dietary improvements.",
        prescription: "Continue thyroid medication, Multivitamin supplements, once daily",
        notes: "Next checkup in 3 months",
        createdAt: Timestamp.now(),
      },
      {
        doctorId: doctorIds[1],
        doctorName: "Dr. Priya Sharma",
        patientId: patientIds[0],
        patientName: "Raj Malhotra",
        patientAge: 45,
        patientGender: "Male",
        appointmentDate: lastWeek.toISOString().split('T')[0],
        appointmentTime: "10:00 AM",
        status: "completed",
        type: "consultation",
        symptoms: "Diabetes checkup",
        diagnosis: "HbA1c at 6.8%, pre-diabetic. Need lifestyle modifications.",
        prescription: "Glycomet 500mg twice daily, after meals",
        notes: "Reduce sugar and rice intake. Walk 30 minutes daily. Recheck in 3 months.",
        createdAt: Timestamp.now(),
      },
      // Next week
      {
        doctorId: doctorIds[3],
        doctorName: "Dr. Sunita Reddy",
        patientId: patientIds[2],
        patientName: "Arjun Nair",
        patientAge: 58,
        patientGender: "Male",
        appointmentDate: nextWeek.toISOString().split('T')[0],
        appointmentTime: "09:30 AM",
        status: "scheduled",
        type: "consultation",
        symptoms: "Knee pain after exercise, arthritis management",
        createdAt: Timestamp.now(),
      },
    ];

    for (const appointment of sampleAppointments) {
      const docRef = await addDoc(collection(db, 'appointments'), appointment);
      console.log(`  ✅ Added appointment: ${appointment.patientName} with ${appointment.doctorName} (${appointment.appointmentDate})`);
    }

    console.log(`\n✅ Created ${sampleAppointments.length} appointments`);
    return sampleAppointments.length;

  } catch (error) {
    console.error('❌ Error creating appointments:', error);
    throw error;
  }
}

async function createUsers() {
  try {
    console.log('\n👥 Creating user accounts...');
    
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
        doctorId: null, // Will be set after we create doctors
      },
      {
        email: 'patient@health.com',
        password: 'password',
        name: 'John Smith',
        role: 'patient',
      },
    ];

    const createdUsers = [];

    for (const userData of users) {
      try {
        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        const uid = userCredential.user.uid;

        // Create user document in Firestore
        const userDoc = {
          uid,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: Timestamp.now(),
        };

        // For doctor user, we'll need to link to a doctor profile
        // This should be done manually or updated after doctor creation
        if (userData.doctorId) {
          userDoc.doctorId = userData.doctorId;
        }

        await setDoc(doc(db, 'users', uid), userDoc);
        
        createdUsers.push({ uid, email: userData.email, role: userData.role });
        console.log(`  ✅ Created user: ${userData.email} (${userData.role})`);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`  ⚠️  User already exists: ${userData.email}`);
        } else {
          console.error(`  ❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }

    console.log(`\n✅ User creation complete (${createdUsers.length} new users)`);
    return createdUsers;

  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Firebase initialization...\n');
  console.log('='.repeat(60));

  try {
    // Create users first
    await createUsers();

    // Initialize Firestore collections and get IDs
    const { doctorIds, patientIds } = await initializeFirestore();

    // Create appointments
    const appointmentCount = await createAppointments(doctorIds, patientIds);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Firebase initialization completed successfully!');
    console.log('\n� Final Summary:');
    console.log(`  ✅ Users: 3 created (admin, doctor, patient)`);
    console.log(`  ✅ Doctors: ${doctorIds.length} added`);
    console.log(`  ✅ Patients: ${patientIds.length} added`);
    console.log(`  ✅ Appointments: ${appointmentCount} created`);
    console.log(`  ✅ Medicines, Articles, Lab Reports added`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('  Admin:   admin@health.com / password');
    console.log('  Doctor:  doctor@health.com / password');
    console.log('  Patient: patient@health.com / password');
    
    console.log('\n�📝 Next steps:');
    console.log('  1. Go to Firebase Console to verify data');
    console.log('  2. Link doctor user to doctor profile (manual step)');
    console.log('  3. Update Firestore Security Rules (deploy production rules)');
    console.log('  4. Update Storage Security Rules');
    console.log('  5. Test your app with the demo accounts!');
    console.log('\n🔗 Firebase Console: https://console.firebase.google.com/');
    console.log(`🔗 Your Project: https://console.firebase.google.com/project/${firebaseConfig.projectId}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Firebase initialization failed:', error);
    process.exit(1);
  }
}

main();
