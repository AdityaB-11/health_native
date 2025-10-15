# 🚀 Firebase Complete Setup Guide

## ✅ What's Been Created

1. **Database Initialization Script** (`scripts/initFirebase.js`)
2. **Firestore Security Rules** (`firestore.rules`)
3. **Storage Security Rules** (`storage.rules`)
4. **Environment Configuration** (`.env`)

## 📋 Step-by-Step Setup (15 Minutes)

### Step 1: Enable Firebase Services (5 min)

#### A. Enable Authentication

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `health-manage01`
3. Click **Authentication** → **Get started**
4. Click **Email/Password** → Toggle **Enable** → **Save**

#### B. Enable Firestore Database

1. Click **Firestore Database** → **Create database**
2. Choose **Start in production mode** (we'll update rules)
3. Select location: `us-central` (or closest to you)
4. Click **Enable**
5. Wait for database to be created (~30 seconds)

#### C. Enable Storage

1. Click **Storage** → **Get started**
2. Choose **Start in production mode** (we'll update rules)
3. Click **Done**

### Step 2: Deploy Security Rules (2 min)

#### Option A: Using Firebase Console (Easier)

**Firestore Rules:**
1. Go to **Firestore Database** → **Rules** tab
2. Copy content from `firestore.rules` file
3. Paste into the editor
4. Click **Publish**

**Storage Rules:**
1. Go to **Storage** → **Rules** tab
2. Copy content from `storage.rules` file
3. Paste into the editor
4. Click **Publish**

#### Option B: Using Firebase CLI (Advanced)

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage
# - Use existing project: health-manage01

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Step 3: Create Admin User (3 min)

#### A. Create Authentication User

1. Go to **Authentication** → **Users** tab
2. Click **Add user**
3. Enter:
   - Email: `admin@health.com`
   - Password: `Admin@123` (or your secure password)
4. Click **Add user**
5. **Copy the UID** (you'll need this next)

#### B. Create Admin User Document in Firestore

1. Go to **Firestore Database** → **Data** tab
2. Click **Start collection**
3. Collection ID: `users`
4. Click **Next**
5. Document ID: **Paste the UID you copied**
6. Add these fields:
   - Field: `uid` | Type: string | Value: **[paste UID again]**
   - Field: `email` | Type: string | Value: `admin@health.com`
   - Field: `name` | Type: string | Value: `Admin User`
   - Field: `role` | Type: string | Value: `admin`
   - Field: `createdAt` | Type: timestamp | Value: [click "Set to current time"]
7. Click **Save**

### Step 4: Initialize Database with Sample Data (5 min)

Run the initialization script to populate your database:

```bash
# Make sure you're in the project directory
cd /home/aditya11/Documents/playground/projects/health_native

# Run the initialization script
node scripts/initFirebase.js
```

**Expected Output:**
```
✅ Firebase initialized successfully!
📦 Project ID: health-manage01

🔄 Initializing Firestore collections...

📋 Creating doctors collection...
  ✅ Added doctor: Dr. Sarah Johnson (ID: abc123...)
  ✅ Added doctor: Dr. Michael Chen (ID: def456...)
  ... (5 doctors total)

💊 Creating medicines collection...
  ✅ Added medicine: Aspirin (ID: ghi789...)
  ... (6 medicines total)

📰 Creating articles collection...
  ✅ Added article: 10 Tips for a Healthy Heart (ID: jkl012...)
  ... (3 articles total)

👥 Creating patients collection...
  ✅ Added patient: John Doe (ID: mno345...)
  ... (3 patients total)

🔬 Creating labReports collection...
  ✅ Added lab report: Blood Sugar Test for John Doe (ID: pqr678...)
  ... (3 lab reports total)

✅ Firestore initialization complete!

📊 Summary:
  - Doctors: 5 added
  - Medicines: 6 added
  - Articles: 3 added
  - Patients: 3 added
  - Lab Reports: 3 added

🎉 Firebase initialization completed successfully!
```

### Step 5: Verify Data in Firebase Console (2 min)

1. Go to **Firestore Database** → **Data** tab
2. You should see these collections:
   - ✅ `users` (1 document - your admin user)
   - ✅ `doctors` (5 documents)
   - ✅ `medicines` (6 documents)
   - ✅ `articles` (3 documents)
   - ✅ `patients` (3 documents)
   - ✅ `labReports` (3 documents)

Click on each collection to verify the data was added correctly.

### Step 6: Update App to Use Firebase (Already Done!)

Your app is already configured to use Firebase:
- ✅ `src/config/firebase.ts` - Firebase initialization
- ✅ `src/api/firebaseServices.ts` - Database operations
- ✅ `src/api/firebaseAuth.ts` - Authentication functions
- ✅ `.env` - Your Firebase credentials

## 🧪 Test Your Setup

### Test 1: Check Firebase Console
- Visit: https://console.firebase.google.com/project/health-manage01
- Verify all services are enabled
- Check Firestore has data
- Check rules are deployed

### Test 2: Test Authentication
1. Run your app: `npm start`
2. Login with:
   - Email: `admin@health.com`
   - Password: `Admin@123`
3. You should be logged in as admin

### Test 3: Test Data Fetching
1. Navigate to Doctors tab
2. You should see 5 doctors
3. Navigate to Medicines tab
4. You should see 6 medicines
5. Navigate to Articles tab
6. You should see 3 articles

### Test 4: Test Admin Features (Admin Only)
1. Login as admin
2. Click Admin tab (should be visible)
3. Try viewing Patients (should see 3 patients)
4. Try viewing Lab Reports (should see 3 reports)

## 📊 Database Structure

### Collections Created:

```
📁 Firestore Database
├── 📁 users/
│   └── {userId}
│       ├── uid: string
│       ├── email: string
│       ├── name: string
│       ├── role: "admin" | "user"
│       └── createdAt: timestamp
│
├── 📁 doctors/ (5 documents)
│   └── {doctorId}
│       ├── name: string
│       ├── specialization: string
│       ├── hospital: string
│       ├── location: string
│       ├── rating: number
│       ├── experience: number
│       ├── consultationFee: number
│       ├── available: boolean
│       ├── phone: string
│       ├── email: string
│       └── createdAt: timestamp
│
├── 📁 medicines/ (6 documents)
│   └── {medicineId}
│       ├── name: string
│       ├── genericName: string
│       ├── manufacturer: string
│       ├── category: string
│       ├── dosageForm: string
│       ├── strength: string
│       ├── price: number
│       ├── inStock: boolean
│       ├── prescriptionRequired: boolean
│       ├── description: string
│       └── createdAt: timestamp
│
├── 📁 articles/ (3 documents)
│   └── {articleId}
│       ├── title: string
│       ├── content: string
│       ├── category: string
│       ├── author: string
│       ├── readTime: number
│       ├── tags: array
│       ├── publishedDate: timestamp
│       └── createdAt: timestamp
│
├── 📁 patients/ (3 documents) - ADMIN ONLY
│   └── {patientId}
│       ├── name: string
│       ├── age: number
│       ├── gender: string
│       ├── bloodGroup: string
│       ├── phone: string
│       ├── email: string
│       ├── address: string
│       ├── medicalHistory: string
│       └── createdAt: timestamp
│
└── 📁 labReports/ (3 documents) - ADMIN ONLY
    └── {reportId}
        ├── patientId: string
        ├── patientName: string
        ├── testType: string
        ├── date: timestamp
        ├── status: "pending" | "completed"
        ├── results: object
        ├── notes: string
        └── createdAt: timestamp
```

### Storage Structure:

```
📁 Firebase Storage
├── 📁 lab-reports/        (Admin only - PDF files)
├── 📁 articles/           (Public read, admin write - images)
├── 📁 profiles/           (User's own profile pictures)
├── 📁 doctors/            (Doctor profile pictures)
└── 📁 medicines/          (Medicine product images)
```

## 🔒 Security Rules Summary

### Firestore Rules:
- ✅ **Public Read**: doctors, medicines, articles
- ✅ **Admin Only**: patients, labReports (HIPAA compliance)
- ✅ **User Own Data**: users can update their own profile
- ✅ **Admin All Access**: admins can manage all data

### Storage Rules:
- ✅ **Lab Reports**: Admin only (read/write)
- ✅ **Articles**: Public read, admin write
- ✅ **Profiles**: Users can upload own, public read
- ✅ **Max File Size**: 10MB
- ✅ **File Type Validation**: Images (jpg, png) and PDFs

## 🚨 Troubleshooting

### Error: "Permission denied"
**Solution**: Make sure you:
1. Deployed security rules correctly
2. Created admin user in both Authentication AND Firestore
3. Set role to "admin" in Firestore user document

### Error: "Collection not found"
**Solution**: Run the initialization script:
```bash
node scripts/initFirebase.js
```

### Error: "Firebase not initialized"
**Solution**: Check `.env` file has correct values (no typos)

### Script fails with authentication error
**Solution**: 
1. Make sure Firestore is enabled in Firebase Console
2. Check that security rules allow writes
3. Temporarily set rules to test mode for initialization

## 📝 Next Steps

1. ✅ **Test the app** - Login and verify all features work
2. ✅ **Add more data** - Use admin panel to add doctors, medicines
3. ✅ **Test file upload** - Try uploading a lab report (admin)
4. ✅ **Customize** - Modify sample data or add your own
5. ✅ **Deploy** - When ready, deploy your app!

## 🔗 Important Links

- **Firebase Console**: https://console.firebase.google.com/project/health-manage01
- **Firestore Data**: https://console.firebase.google.com/project/health-manage01/firestore
- **Authentication**: https://console.firebase.google.com/project/health-manage01/authentication
- **Storage**: https://console.firebase.google.com/project/health-manage01/storage

## 🎉 You're All Set!

Your Firebase backend is now fully configured with:
- ✅ Authentication enabled
- ✅ Firestore database with sample data
- ✅ Security rules deployed
- ✅ Storage configured
- ✅ Admin user created

**Login credentials:**
- Email: `admin@health.com`
- Password: `Admin@123`

---

**Need help?** Check the other Firebase documentation files or visit the Firebase Console.
