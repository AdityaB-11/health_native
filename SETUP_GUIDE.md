# HealthNative Setup Guide

## Quick Start

### Step 1: Install Dependencies

```bash
cd health_native
npm install
```

### Step 2: Start the Development Server

```bash
npm start
```

This will start the Expo development server. You'll see a QR code in the terminal.

### Step 3: Run the App

**Option 1: Using Expo Go (Easiest)**
1. Install Expo Go app on your phone:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779
2. Scan the QR code with your phone camera (iOS) or Expo Go app (Android)

**Option 2: Using Emulator/Simulator**
- Android: `npm run android` (requires Android Studio)
- iOS: `npm run ios` (requires Xcode, macOS only)

**Option 3: Web Browser**
```bash
npm run web
```

## Login Credentials

### Admin Account
- Email: `admin@health.com`
- Password: `password`
- Features: Full access including admin panel

### Regular User Account
- Email: `user@health.com`
- Password: `password`
- Features: Standard user access

## Project Features

### 1. **Authentication System**
- JWT-based authentication
- Token stored in AsyncStorage
- Auto-login on app restart
- Secure logout

### 2. **Doctor Management**
- Browse 5 sample doctors
- Search by name, specialization, or location
- View detailed doctor profiles
- Book appointments (UI ready)

### 3. **Patient Management**
- View patient list
- Detailed patient profiles
- Medical history tracking
- Allergy information
- Current medications

### 4. **Medicine Catalog**
- Browse 6 sample medicines
- Search functionality
- Stock status
- Prescription requirements
- Indian pricing (₹)

### 5. **Lab Reports**
- Upload PDF documents
- Upload images (JPG, PNG)
- View report history
- Patient-specific filtering

### 6. **Health Articles**
- 5 India-focused articles
- Categories and tags
- Reading time estimates
- Search functionality

### 7. **Admin Panel** (Admin only)
- Add new doctors
- Add medicines
- Publish articles
- Content management

## Mock Data Details

### Doctors (5 samples)
- Specializations: Cardiology, Pediatrics, Orthopedics, Dermatology, Neurology
- Locations: Delhi, Mumbai, Bangalore, Hyderabad
- Consultation fees: ₹1000 - ₹2000

### Patients (4 samples)
- Demographics: Age 28-55
- Blood groups: O+, A+, B+, AB+
- Medical conditions included

### Medicines (6 samples)
- Categories: Analgesics, Antibiotics, Antidiabetics, etc.
- Indian manufacturers: Cipla, Sun Pharma, Dr. Reddy's, etc.
- Realistic pricing

### Articles (5 samples)
Topics:
- Diabetes Prevention & Management
- Heart Health
- Mental Health Awareness
- Child Nutrition
- Yoga & Meditation

## Development Tips

### Switching from Mock to Real API

1. Open `src/api/services.ts`
2. Change `USE_MOCK_DATA` to `false`:
```typescript
const USE_MOCK_DATA = false;
```

3. Update `API_BASE_URL` in `src/api/apiClient.ts`:
```typescript
const API_BASE_URL = 'https://your-api-url.com';
```

### API Endpoints Expected

```
POST   /auth/login
GET    /doctors
GET    /doctors/:id
POST   /doctors
GET    /patients
GET    /patients/:id
GET    /medicines
GET    /medicines/:id
POST   /medicines
GET    /articles
GET    /articles/:id
POST   /articles
GET    /lab-reports?patientId={id}
POST   /lab-reports
```

### Adding New Features

1. **Create a new screen:**
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

const NewScreen = ({ navigation }: any) => {
  return (
    <View>
      <Text>New Screen</Text>
    </View>
  );
};

export default NewScreen;
```

2. **Add route in navigation:**
```typescript
// src/navigation/AppNavigator.tsx
import NewScreen from '../screens/NewScreen';

// Add in Stack.Navigator
<Stack.Screen name="NewScreen" component={NewScreen} />
```

3. **Create API service:**
```typescript
// src/api/services.ts
export const getNewData = async () => {
  const response = await apiClient.get('/new-endpoint');
  return response.data;
};
```

## File Upload Configuration

The app uses Expo's document picker and image picker:

```typescript
// Document picker (PDF)
import * as DocumentPicker from 'expo-document-picker';

const result = await DocumentPicker.getDocumentAsync({
  type: 'application/pdf',
});

// Image picker
import * as ImagePicker from 'expo-image-picker';

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 1,
});
```

## UI Customization

### Theme Colors
Edit in `App.tsx` or individual screens:
```typescript
const theme = {
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f5f5f5',
    // ... more colors
  },
};
```

### Component Library
Using React Native Paper components:
- `Card`, `Button`, `TextInput`
- `Searchbar`, `Chip`, `FAB`
- `List`, `Avatar`, `ActivityIndicator`

## Common Issues & Solutions

### Issue: "Cannot find module 'react'"
**Solution:** Run `npm install`

### Issue: "Expo Go app won't connect"
**Solution:** 
- Ensure phone and computer are on same WiFi
- Try tunnel mode: `expo start --tunnel`

### Issue: "TypeScript errors"
**Solution:** 
- Check tsconfig.json is properly configured
- Run `npm install --save-dev typescript @types/react @types/react-native`

### Issue: "Image picker not working"
**Solution:** 
- Ensure permissions are granted
- Check Expo Go has camera/storage access

## Production Build

### Android APK
```bash
eas build --platform android
```

### iOS IPA
```bash
eas build --platform ios
```

Note: Requires Expo Application Services (EAS) account.

## Testing

### Test Login Flow
1. Open app
2. Use demo credentials
3. Navigate to different screens
4. Test search functionality
5. Upload a test document

### Test Admin Features
1. Login as admin (admin@health.com)
2. Go to Admin tab
3. Add a test doctor/medicine/article
4. Verify it appears in lists

## Performance Tips

1. **Image Optimization**: Use optimized images or CDN
2. **List Performance**: Use `FlatList` for long lists (already implemented)
3. **Navigation**: Use React Navigation's native stack
4. **State Management**: Consider Redux/MobX for larger apps

## Security Considerations

1. **JWT Storage**: Currently using AsyncStorage (secure for mobile)
2. **API Calls**: Use HTTPS in production
3. **Input Validation**: Add validation for forms
4. **File Uploads**: Validate file types and sizes

## Next Steps

1. Connect to real backend API
2. Add more features:
   - Appointment booking
   - Real-time notifications
   - Chat with doctors
   - Payment integration
3. Add unit tests
4. Implement Redux for state management
5. Add analytics (Firebase, Amplitude)

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## Support

For issues or questions:
1. Check README.md
2. Review this setup guide
3. Check Expo documentation
4. Open a GitHub issue

---

**Happy Coding! 🚀**
