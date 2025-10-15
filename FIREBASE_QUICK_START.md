# Firebase Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Get Firebase Configuration

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create a new project** (or select existing)
3. **Click the Web icon** (`</>`) to register your app
4. **Copy the config object** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 2. Update Firebase Config

**Open:** `src/config/firebase.ts`

**Replace** the placeholder config with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  // ... paste your config here
};
```

### 3. Enable Firebase Services

#### Enable Authentication
1. Firebase Console → **Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** sign-in method
4. Click **Save**

#### Enable Firestore
1. Firebase Console → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose location (e.g., `us-central`)
5. Click **Enable**

#### Enable Storage (for lab reports)
1. Firebase Console → **Storage**
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Click **Done**

### 4. Update Security Rules

#### Firestore Rules
Firebase Console → **Firestore → Rules**, paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules
Firebase Console → **Storage → Rules**, paste this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Create Test User

1. Firebase Console → **Authentication → Users**
2. Click **"Add user"**
3. Email: `admin@test.com`
4. Password: `admin123`
5. Click **Add user**

### 6. Create Admin User Document

1. Firebase Console → **Firestore Database**
2. Click **"Start collection"**
3. Collection ID: `users`
4. Document ID: **Copy the UID from Authentication tab**
5. Add fields:
   - `email`: `admin@test.com` (string)
   - `name`: `Admin User` (string)
   - `role`: `admin` (string)
   - `uid`: **[paste the UID]** (string)
6. Click **Save**

## ✅ You're Done!

Now you can:
- Login with `admin@test.com` / `admin123`
- Access all admin features
- Add doctors, medicines, articles via the app

## 🔄 Switch from Mock Data to Firebase

### Option 1: Update imports (Recommended)

In each screen file, change:
```typescript
// OLD
import { getDoctors } from '../api/services';

// NEW
import { getDoctors } from '../api/firebaseServices';
```

### Option 2: Update services.ts

Replace the content of `src/api/services.ts` with:
```typescript
export * from './firebaseServices';
```

### Option 3: Update AuthContext

Update `src/context/AuthContext.tsx` to use Firebase auth:
```typescript
import { loginUser, logoutUser, subscribeToAuthChanges, getCurrentUserData } from '../api/firebaseAuth';
```

## 📊 Add Sample Data (Optional)

### Add a Sample Doctor

Firebase Console → Firestore → Create collection `doctors`:

```json
{
  "name": "Dr. Sarah Johnson",
  "specialization": "Cardiologist",
  "hospital": "City General Hospital",
  "location": "New York",
  "rating": 4.8,
  "experience": 15,
  "consultationFee": 200,
  "available": true
}
```

### Add a Sample Medicine

Create collection `medicines`:

```json
{
  "name": "Aspirin",
  "genericName": "Acetylsalicylic Acid",
  "manufacturer": "PharmaCorp",
  "category": "Pain Relief",
  "dosageForm": "Tablet",
  "strength": "500mg",
  "price": 10.99,
  "inStock": true,
  "prescriptionRequired": false
}
```

### Add a Sample Article

Create collection `articles`:

```json
{
  "title": "10 Tips for a Healthy Heart",
  "content": "Your full article content here...",
  "category": "Cardiology",
  "author": "Dr. Sarah Johnson",
  "readTime": 5,
  "tags": ["heart", "health", "prevention"],
  "publishedDate": "2024-01-15"
}
```

## 🐛 Troubleshooting

### Error: "Firebase not initialized"
- Check that you replaced the config in `firebase.ts`
- Make sure you created a Firebase project

### Error: "Permission denied"
- Update Firestore and Storage rules as shown above
- Make sure user is authenticated

### Error: "User not found"
- Create user document in Firestore (step 6 above)
- Make sure `uid` in Firestore matches Authentication UID

### Login not working
- Check Firebase Console → Authentication → Users
- Verify email/password are correct
- Check browser console for errors

## 📚 Next Steps

1. **Add more sample data** in Firebase Console
2. **Test all features** with Firebase backend
3. **Update security rules** for production (see `FIREBASE_SETUP_GUIDE.md`)
4. **Add error handling** for offline scenarios
5. **Implement data caching** for better performance

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Full Setup Guide](./FIREBASE_SETUP_GUIDE.md)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**🎉 Congratulations!** Your app is now connected to Firebase!
