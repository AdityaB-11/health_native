# Firebase Integration Guide for Health Native App

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Console Setup](#firebase-console-setup)
3. [Configure Firebase in App](#configure-firebase-in-app)
4. [Firestore Database Structure](#firestore-database-structure)
5. [Authentication Setup](#authentication-setup)
6. [Storage Setup](#storage-setup)
7. [Security Rules](#security-rules)
8. [Testing](#testing)

## ✅ Prerequisites

- Firebase account (Google account)
- Node.js and npm installed
- Expo CLI installed
- Firebase package already installed ✅

## 🔥 Firebase Console Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `health-native` (or your preferred name)
4. Enable/disable Google Analytics (recommended: enable)
5. Click "Create Project"

### Step 2: Register Your App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Enter app nickname: `Health Native Web`
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click "Register app"
5. **Copy the Firebase configuration object** - you'll need this!

### Step 3: Enable Required Services

#### A. Enable Authentication
1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Enable Sign-in methods:
   - **Email/Password**: Click to enable
   - Optionally enable: Google, Facebook, etc.
4. Click "Save"

#### B. Create Firestore Database
1. Go to **Build > Firestore Database**
2. Click "Create database"
3. Choose mode:
   - **Start in test mode** (for development)
   - Later, update to production mode with proper rules
4. Select location (choose closest to your users)
5. Click "Enable"

#### C. Enable Storage
1. Go to **Build > Storage**
2. Click "Get started"
3. Start in **test mode** (for development)
4. Select location (same as Firestore)
5. Click "Done"

## ⚙️ Configure Firebase in App

### Step 1: Add Your Firebase Config

1. Open `/src/config/firebase.ts`
2. Replace the placeholder config with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "health-native-xxxxx.firebaseapp.com",
  projectId: "health-native-xxxxx",
  storageBucket: "health-native-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

### Step 2: Environment Variables (Recommended)

For security, use environment variables:

1. Create `.env` file in project root:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. Update `firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
```

3. Add `.env` to `.gitignore`:
```
.env
```

## 🗄️ Firestore Database Structure

### Collections Schema

```
📁 users/
  └─ {userId}
      ├─ name: string
      ├─ email: string
      ├─ role: "admin" | "user"
      ├─ phone: string
      ├─ createdAt: timestamp
      
📁 doctors/
  └─ {doctorId}
      ├─ name: string
      ├─ specialization: string
      ├─ hospital: string
      ├─ location: string
      ├─ rating: number
      ├─ experience: number
      ├─ consultationFee: number
      ├─ available: boolean
      ├─ createdAt: timestamp
      
📁 medicines/
  └─ {medicineId}
      ├─ name: string
      ├─ genericName: string
      ├─ manufacturer: string
      ├─ category: string
      ├─ dosageForm: string
      ├─ strength: string
      ├─ price: number
      ├─ inStock: boolean
      ├─ prescriptionRequired: boolean
      ├─ createdAt: timestamp
      
📁 articles/
  └─ {articleId}
      ├─ title: string
      ├─ content: string
      ├─ category: string
      ├─ author: string
      ├─ readTime: number
      ├─ tags: array
      ├─ imageUrl: string (optional)
      ├─ publishedDate: timestamp
      ├─ createdAt: timestamp
      
📁 patients/
  └─ {patientId}
      ├─ name: string
      ├─ age: number
      ├─ gender: string
      ├─ bloodGroup: string
      ├─ phone: string
      ├─ email: string
      ├─ address: string (optional)
      ├─ createdAt: timestamp
      
📁 labReports/
  └─ {reportId}
      ├─ patientId: string
      ├─ patientName: string
      ├─ testType: string
      ├─ date: timestamp
      ├─ status: "pending" | "completed"
      ├─ fileUrl: string (optional)
      ├─ results: object (optional)
      ├─ createdAt: timestamp
```

### Initialize Sample Data (Optional)

You can add sample data directly in Firebase Console or create a script.

## 🔐 Authentication Setup

### Firestore Security Rules

Go to **Firestore Database > Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == userId;
      allow create: if isSignedIn();
    }
    
    // Doctors collection
    match /doctors/{doctorId} {
      allow read: if true; // Public read
      allow write: if isAdmin(); // Only admins can modify
    }
    
    // Medicines collection
    match /medicines/{medicineId} {
      allow read: if true; // Public read
      allow write: if isAdmin(); // Only admins can modify
    }
    
    // Articles collection
    match /articles/{articleId} {
      allow read: if true; // Public read
      allow write: if isAdmin(); // Only admins can modify
    }
    
    // Patients collection (ADMIN ONLY)
    match /patients/{patientId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // Lab Reports collection (ADMIN ONLY)
    match /labReports/{reportId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

### Storage Security Rules

Go to **Storage > Rules** and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Lab reports - admin only
    match /lab-reports/{allPaths=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // Article images - admin can write, all can read
    match /articles/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Profile images
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if isSignedIn() && request.auth.uid == userId;
    }
  }
}
```

## 🧪 Testing

### Test Authentication

1. Create a test user in Firebase Console:
   - Go to **Authentication > Users**
   - Click "Add user"
   - Email: `admin@test.com`, Password: `admin123`
   
2. Add user role in Firestore:
   - Go to **Firestore Database**
   - Create collection `users`
   - Add document with ID matching the user UID
   - Add field: `role` with value `"admin"`
   - Add field: `email` with value `"admin@test.com"`
   - Add field: `name` with value `"Admin User"`

### Test Firestore

1. Add sample doctor in Firebase Console:
   - Go to **Firestore > doctors collection**
   - Click "Add document"
   - Auto-generate ID or use custom ID
   - Add fields from the schema above

## 📝 Next Steps

1. **Update AuthContext** to use Firebase Authentication
2. **Update API services** to use Firestore instead of mock data
3. **Implement Storage** for lab report uploads
4. **Add error handling** for Firebase operations
5. **Implement offline persistence** (optional)
6. **Set up Firebase Analytics** (optional)

## 🚨 Important Security Notes

1. **Never commit Firebase config** with real API keys to public repositories
2. **Always use environment variables** for sensitive data
3. **Update security rules** to production mode before deployment
4. **Enable App Check** for additional security in production
5. **Set up billing alerts** to avoid unexpected charges
6. **Regularly review Firebase usage** and security rules

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)
- [Security Rules](https://firebase.google.com/docs/rules)

---

**Need Help?**
- Check the [Firebase Console](https://console.firebase.google.com/)
- Review the [Expo Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- Firebase support: firebase-support@google.com
