# 🔐 Environment Variables Setup

## ✅ Files Created

1. **`.env`** - Your actual Firebase credentials (keep private!)
2. **`.env.example`** - Template file (safe to commit to git)
3. **`src/config/firebase.ts`** - Updated to use environment variables

## 🚀 How to Set Up

### Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll down to **Your apps** section
5. Click the **Web app** icon `</>`
6. If you haven't added a web app yet:
   - Click "Add app"
   - Enter app nickname: `Health Native`
   - **Don't** check "Also set up Firebase Hosting"
   - Click "Register app"
7. Copy the config values from the `firebaseConfig` object

### Step 2: Update `.env` File

Open the `.env` file and replace the placeholder values with your actual Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=health-native-12345.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=health-native-12345
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=health-native-12345.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### Step 3: Restart Your Development Server

After updating `.env`, you **MUST** restart:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` file private (it's already in `.gitignore`)
- Use `.env.example` to share structure (without real values)
- Add different `.env` files for different environments:
  - `.env.development`
  - `.env.production`
- Rotate API keys if accidentally exposed

### ❌ DON'T:
- Commit `.env` to git
- Share `.env` file publicly
- Hardcode credentials in source code
- Push `.env` to GitHub/GitLab

## 📋 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Your Firebase Web API Key | `AIzaSy...` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Authentication domain | `project-id.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase project ID | `health-native-12345` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Cloud Storage bucket | `project-id.appspot.com` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | `123456789012` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Your app ID | `1:123...` |
| `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` | (Optional) Analytics ID | `G-XXXXXXXXXX` |

## 🔍 How It Works

### Before (Hardcoded):
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // ❌ Exposed in code
  authDomain: "health-native-12345.firebaseapp.com",
  // ...
};
```

### After (Environment Variables):
```typescript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY, // ✅ Loaded from .env
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

## 🧪 Verify It's Working

1. Update your `.env` file with real Firebase credentials
2. Restart the development server: `npm start`
3. Check the terminal for errors
4. Try logging in to your app

If you see errors like "Firebase not initialized", check:
- `.env` file has correct values
- You restarted the dev server
- Variable names start with `EXPO_PUBLIC_`

## 📝 Example Firebase Config

Here's what your Firebase Console config looks like:

```javascript
// From Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "health-native-abc123.firebaseapp.com",
  projectId: "health-native-abc123",
  storageBucket: "health-native-abc123.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:abcdef123456"
};
```

Copy each value to your `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=health-native-abc123.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=health-native-abc123
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=health-native-abc123.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321012
EXPO_PUBLIC_FIREBASE_APP_ID=1:987654321012:web:abcdef123456
```

## 🚨 If You Accidentally Expose Credentials

1. **Immediately** regenerate your API keys:
   - Firebase Console → Project Settings → Service accounts
   - Create new web app with new credentials
   - Delete old app

2. **Update** your `.env` file with new credentials

3. **Review** your git history:
   ```bash
   git log --all --full-history -- .env
   ```

4. If committed, consider using `git filter-branch` or BFG Repo-Cleaner

## 📚 Additional Resources

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/api-keys)
- [Expo Public Variables](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables)

## ✨ Next Steps

1. ✅ Update `.env` with your Firebase credentials
2. ✅ Restart development server (`npm start`)
3. ✅ Test login functionality
4. ✅ Never commit `.env` to version control!

---

**🎉 Your Firebase credentials are now secure!**

**Note:** The `.env` file is already in `.gitignore`, so it won't be committed to git.
