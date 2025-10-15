````markdown
# HealthNative - React Native Healthcare Management App

A comprehensive Healthcare Management System built with React Native, Expo, and TypeScript.

## Features

- **Authentication**: Email/password login with JWT token management
- **Doctor Management**: Browse doctors, view details, specializations
- **Patient Management**: View patient profiles, medical history, allergies
- **Medicine Catalog**: Search and browse medicines with detailed information
- **Lab Reports**: Upload and view lab reports (PDF/Images)
- **Health Articles**: Read curated health articles and tips
- **Admin Panel**: Add doctors, medicines, and articles (admin users only)

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **Axios** for API calls
- **AsyncStorage** for JWT token persistence
- **Expo Document Picker & Image Picker** for file uploads

## Project Structure

```
health_native/
├── src/
│   ├── api/
│   │   ├── apiClient.ts       # Axios instance with interceptors
│   │   ├── services.ts        # API service functions
│   │   └── mockData.ts        # Mock data for development
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Navigation configuration
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── DoctorListScreen.tsx
│   │   ├── DoctorDetailScreen.tsx
│   │   ├── PatientListScreen.tsx
│   │   ├── PatientProfileScreen.tsx
│   │   ├── MedicineListScreen.tsx
│   │   ├── MedicineDetailScreen.tsx
│   │   ├── ArticleListScreen.tsx
│   │   ├── ArticleDetailScreen.tsx
│   │   ├── LabReportsScreen.tsx
│   │   ├── UploadReportScreen.tsx
│   │   ├── AdminScreen.tsx
│   │   ├── AddDoctorScreen.tsx
│   │   ├── AddMedicineScreen.tsx
│   │   └── AddArticleScreen.tsx
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── App.tsx
├── package.json
└── tsconfig.json
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## Demo Credentials

- **Admin**: admin@health.com / password
- **User**: user@health.com / password

## Mock Data

The app includes comprehensive India-focused mock data:
- 5 doctors from various specializations
- 4 patient profiles with medical history
- 6 medicines with Indian pricing
- 5 health articles with Indian context
- Sample lab reports

## API Integration

To connect to a real backend:
1. Update `API_BASE_URL` in `src/api/apiClient.ts`
2. Set `USE_MOCK_DATA = false` in `src/api/services.ts`
3. Implement actual API endpoints

## Features by Screen

### Authentication
- Login with email/password
- JWT token storage
- Auto-login on app restart

### Doctor Management
- List all doctors with search
- View doctor details, qualifications, availability
- Filter by specialization, location

### Patient Management
- View patient list with search
- Patient profile with complete medical history
- Allergies and current medications

### Medicine Catalog
- Browse medicines with search
- Detailed medicine information
- Stock status and pricing
- Prescription requirements

### Lab Reports
- Upload PDF or image reports
- View all reports by patient
- Report metadata and notes

### Health Articles
- Browse curated health articles
- Search by title, category, tags
- Read detailed articles with formatting

### Admin Panel (Admin only)
- Add new doctors
- Add medicines to catalog
- Publish health articles
- Manage all content

## Customization

### UI Theme
Colors can be customized in the Paper Provider theme in `App.tsx`

### Add New Features
1. Create new screen in `src/screens/`
2. Add route in `src/navigation/AppNavigator.tsx`
3. Create API service in `src/api/services.ts`
4. Add TypeScript types in `src/types/index.ts`

## License

MIT

## Support

For issues and questions, please open a GitHub issue.

````