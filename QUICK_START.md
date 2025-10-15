# Quick Start Guide 🚀

## Launch the App

```bash
npm start
# or
npx expo start
```

Scan the QR code with Expo Go app on your phone.

---

## Demo Accounts

### 1. **Admin Account**
```
Email:    admin@health.com
Password: password
```

**What you can do:**
- ✅ View all doctors, patients, medicines
- ✅ Add new doctors (AddDoctorScreen)
- ✅ Add new medicines (AddMedicineScreen)
- ✅ Add new articles (AddArticleScreen)
- ✅ Access admin panel
- ✅ View patient list with search

### 2. **Doctor Account**
```
Email:    doctor@health.com
Password: password
```

**What you can do:**
- ✅ View your dashboard with today's appointments
- ✅ See all your patients
- ✅ View appointment schedule (Today/Upcoming/Past)
- ✅ View detailed patient medical history
- ✅ See patient lab reports
- ✅ Read health articles

### 3. **Patient Account**
```
Email:    patient@health.com
Password: password
```

**What you can do:**
- ✅ Browse available doctors (6 Indian doctors)
- ✅ View doctor details and book appointments
- ✅ Browse medicines (8 Indian medicines)
- ✅ Read health articles (4 India-oriented)
- ✅ View your lab reports
- ✅ Upload lab reports

---

## Sample Data

### Indian Doctors (6)
1. **Dr. Rajesh Kumar** - Cardiologist, Apollo Delhi - ₹800
2. **Dr. Priya Sharma** - Gynecologist, Fortis Mumbai - ₹1000
3. **Dr. Amit Patel** - Dermatologist, Max Bangalore - ₹700
4. **Dr. Sunita Reddy** - Orthopedic, Manipal Hyderabad - ₹750
5. **Dr. Vikram Singh** - General Physician, AIIMS Delhi - ₹600
6. **Dr. Meera Iyer** - Pediatrician, Cloudnine Chennai - ₹900

### Indian Medicines (8)
1. **Dolo 650** - Pain relief - ₹25
2. **Azithromycin** - Antibiotic - ₹85
3. **Telma 40** - Blood pressure - ₹120
4. **Glycomet** - Diabetes - ₹45
5. **Pan 40** - Acidity - ₹60
6. **Crocin Advance** - Fever - ₹30
7. **Cheston Cold** - Cold/cough - ₹55
8. **Becosules** - Multivitamin - ₹40

### Health Articles (4)
1. **Heart Health in Indian Diet** (Dr. Rajesh Kumar)
2. **Managing Diabetes: The Indian Context** (Dr. Priya Sharma)
3. **Skin Care in Indian Climate** (Dr. Amit Patel)
4. **Yoga and Mental Health** (Dr. Vikram Singh)

### Patients (3)
1. **Raj Malhotra** - 45, Green Park, Delhi
2. **Priya Desai** - 32, Bandra West, Mumbai
3. **Arjun Nair** - 58, Whitefield, Bangalore

---

## Navigation Guide

### As Admin:
**Bottom Tabs:**
- 🏠 Home → Home screen
- 👨‍⚕️ Doctors → Doctor list → Doctor details
- 💊 Medicines → Medicine list → Medicine details
- 📰 Articles → Article list → Article details
- ⚙️ Admin → Admin panel
  - Add Doctor
  - Add Medicine
  - Add Article
  - View Patients

### As Doctor:
**Bottom Tabs:**
- 📊 Dashboard → Overview, stats, today's appointments
- 📅 Appointments → All appointments (filters: Today/Upcoming/Past)
- 👥 Patients → Patient list → Patient details
  - Medical history
  - Past appointments
  - Lab reports
- 📰 Articles → Health articles

### As Patient:
**Bottom Tabs:**
- 🏠 Home → Home screen
- 👨‍⚕️ Doctors → Browse doctors → Doctor details → Book appointment
- 💊 Medicines → Browse medicines → Medicine details
- 📰 Articles → Read health articles
- 🔬 Reports → View lab reports → Upload new report

---

## Key Features

### ✅ Real-time Data
- All data fetched from Firebase Firestore
- Changes reflect immediately

### ✅ India-Oriented
- Indian doctor names, hospitals, cities
- Indian medicines (Dolo 650, Pan 40, etc.)
- Prices in INR (₹)
- Phone numbers in +91 format
- India-relevant health topics

### ✅ Role-Based Access
- Admin can add doctors/medicines/articles
- Doctors can view their patients and appointments
- Patients can browse and view their reports

### ✅ Search & Filter
- Search doctors by name/specialization/location
- Search medicines by name/category
- Search articles by title
- Filter appointments by date

### ✅ Beautiful UI
- Material Design with React Native Paper
- Gradient effects
- Icons from MaterialCommunityIcons
- Smooth animations

---

## Troubleshooting

### "No data showing"
- Check internet connection
- Verify Firebase is initialized (check console logs)
- Make sure you ran `node scripts/initFirebase.js`

### "Authentication error"
- Make sure Email/Password auth is enabled in Firebase Console
- Use correct credentials (see above)

### "Can't add data"
- Check Firestore rules (currently in test mode, should work)
- Check console for errors

---

## Next Steps

1. **Test all features:**
   - Login with each account type
   - Browse doctors, medicines, articles
   - View appointments (doctor account)
   - Check lab reports

2. **Add your own data:**
   - Use admin account to add new doctors
   - Add new medicines
   - Add new articles

3. **Customize:**
   - Update Firebase config with your project
   - Modify UI colors/styles
   - Add more features (booking, payments, etc.)

---

## Firebase Console

**View your data:**
https://console.firebase.google.com/project/health-manage01/firestore

**Manage users:**
https://console.firebase.google.com/project/health-manage01/authentication

---

## Need Help?

Check these files:
- `FIRESTORE_INTEGRATION_COMPLETE.md` - Full implementation details
- `FIREBASE_SETUP_GUIDE.md` - Firebase setup instructions
- `DOCTOR_PORTAL_GUIDE.md` - Doctor portal documentation
- `PROJECT_SUMMARY.md` - Overall project summary

---

**Enjoy using the Health Native app! 🎉**
