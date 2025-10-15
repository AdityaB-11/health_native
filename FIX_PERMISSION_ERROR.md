# 🔧 Fix Permission Denied Error

## Problem
You're getting: `PERMISSION_DENIED: Missing or insufficient permissions`

This happens because Firestore is in production mode by default, which blocks all writes.

## ✅ Solution: Temporarily Enable Test Mode

### Option 1: Firebase Console (Quick - 2 minutes)

1. **Go to Firestore Rules**: 
   https://console.firebase.google.com/project/health-manage01/firestore/rules

2. **Replace all rules with this**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ⚠️ TEMPORARY - Allow all access
    }
  }
}
```

3. **Click "Publish"**

4. **Wait 10 seconds** for rules to propagate

5. **Run the script again**:
```bash
/usr/bin/node scripts/initFirebase.js
```

6. **After successful initialization, deploy production rules**:
   - Go back to Firestore Rules
   - Copy content from `firestore.rules` file in your project
   - Paste and publish

---

### Option 2: Firebase CLI (If you prefer)

```bash
# Create temporary test rules file
cat > firestore.test.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
EOF

# Deploy test rules
firebase deploy --only firestore:rules --project health-manage01

# Run initialization script
/usr/bin/node scripts/initFirebase.js

# Deploy production rules
firebase deploy --only firestore:rules --project health-manage01
```

---

## 📋 Complete Steps

### Step 1: Set Test Mode Rules (2 min)
✅ Go to: https://console.firebase.google.com/project/health-manage01/firestore/rules
✅ Replace with test mode rules (allow all)
✅ Click "Publish"
✅ Wait 10 seconds

### Step 2: Run Initialization Script (2 min)
```bash
cd /home/aditya11/Documents/playground/projects/health_native
/usr/bin/node scripts/initFirebase.js
```

**Expected Success:**
```
✅ Firebase initialized successfully!
📦 Project ID: health-manage01

🔄 Initializing Firestore collections...

📋 Creating doctors collection...
  ✅ Added doctor: Dr. Sarah Johnson (ID: xyz123...)
  ✅ Added doctor: Dr. Michael Chen (ID: abc456...)
  ... (5 total)

💊 Creating medicines collection...
  ✅ Added medicine: Aspirin (ID: def789...)
  ... (6 total)

📰 Creating articles collection...
  ✅ Added article: 10 Tips for a Healthy Heart
  ... (3 total)

👥 Creating patients collection...
  ✅ Added patient: John Doe
  ... (3 total)

🔬 Creating labReports collection...
  ✅ Added lab report: Blood Sugar Test
  ... (3 total)

🎉 Firebase initialization completed successfully!

📊 Summary:
  - Doctors: 5 added
  - Medicines: 6 added
  - Articles: 3 added
  - Patients: 3 added
  - Lab Reports: 3 added
```

### Step 3: Deploy Production Rules (2 min)
✅ Go to: https://console.firebase.google.com/project/health-manage01/firestore/rules
✅ Copy content from `firestore.rules` file
✅ Paste into editor
✅ Click "Publish"

---

## 🔒 Production Rules (from firestore.rules)

After initialization is complete, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Doctors collection - public read, admin write
    match /doctors/{doctorId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Medicines collection - public read, admin write
    match /medicines/{medicineId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Articles collection - public read, admin write
    match /articles/{articleId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Patients collection - ADMIN ONLY
    match /patients/{patientId} {
      allow read, write: if isAdmin();
    }
    
    // Lab Reports collection - ADMIN ONLY
    match /labReports/{reportId} {
      allow read, write: if isAdmin();
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🎯 Quick Action Checklist

- [ ] **1. Set test mode rules** (allow all temporarily)
- [ ] **2. Wait 10 seconds** for rules to propagate
- [ ] **3. Run**: `/usr/bin/node scripts/initFirebase.js`
- [ ] **4. Verify data created** in Firestore console
- [ ] **5. Deploy production rules** (from firestore.rules file)
- [ ] **6. Create admin user** in Authentication
- [ ] **7. Create admin user document** in Firestore users collection
- [ ] **8. Test your app!**

---

## 🔗 Direct Links

| Action | Link |
|--------|------|
| **Firestore Rules** | https://console.firebase.google.com/project/health-manage01/firestore/rules |
| **Firestore Data** | https://console.firebase.google.com/project/health-manage01/firestore/data |
| **Authentication** | https://console.firebase.google.com/project/health-manage01/authentication/users |

---

## ⚠️ Important Security Notes

1. **Test mode rules** (`allow read, write: if true`) are **ONLY** for initialization
2. **Never leave test mode in production** - anyone can read/write your data
3. **Always deploy production rules** after initialization
4. **Production rules** require authentication and role-based access

---

## 🆘 Still Having Issues?

### If script still fails:
1. Check Firestore is enabled (not just created)
2. Wait 30 seconds after publishing rules
3. Check Firebase Console for service status
4. Try running script again

### If rules won't publish:
1. Check for syntax errors in rules editor
2. Make sure you clicked "Publish" button
3. Wait for confirmation message

### If data doesn't appear:
1. Go to Firestore → Data tab
2. Refresh the page
3. Check for error messages in console
4. Verify collections were created

---

**Next**: After successful initialization, see `FIREBASE_COMPLETE_SETUP.md` for admin user creation!
