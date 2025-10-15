import { Doctor, Patient, Medicine, Article, LabReport } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD (Cardiology)',
    experience: 15,
    hospital: 'Apollo Hospital',
    location: 'Delhi',
    availability: 'Mon-Sat, 10 AM - 6 PM',
    consultationFee: 1500,
    rating: 4.8,
    imageUrl: 'https://via.placeholder.com/150',
    phone: '+91-9876543210',
    email: 'dr.rajesh@apollo.com',
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 10,
    hospital: 'Fortis Hospital',
    location: 'Mumbai',
    availability: 'Mon-Fri, 9 AM - 5 PM',
    consultationFee: 1200,
    rating: 4.9,
    imageUrl: 'https://via.placeholder.com/150',
    phone: '+91-9876543211',
    email: 'dr.priya@fortis.com',
  },
  {
    id: '3',
    name: 'Dr. Amit Patel',
    specialization: 'Orthopedic Surgeon',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 12,
    hospital: 'Max Hospital',
    location: 'Bangalore',
    availability: 'Tue-Sun, 11 AM - 7 PM',
    consultationFee: 1800,
    rating: 4.7,
    imageUrl: 'https://via.placeholder.com/150',
    phone: '+91-9876543212',
    email: 'dr.amit@max.com',
  },
  {
    id: '4',
    name: 'Dr. Sneha Reddy',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 8,
    hospital: 'Manipal Hospital',
    location: 'Hyderabad',
    availability: 'Mon-Sat, 10 AM - 4 PM',
    consultationFee: 1000,
    rating: 4.6,
    imageUrl: 'https://via.placeholder.com/150',
    phone: '+91-9876543213',
    email: 'dr.sneha@manipal.com',
  },
  {
    id: '5',
    name: 'Dr. Vikram Singh',
    specialization: 'Neurologist',
    qualification: 'MBBS, DM (Neurology)',
    experience: 20,
    hospital: 'AIIMS',
    location: 'Delhi',
    availability: 'Mon-Fri, 8 AM - 2 PM',
    consultationFee: 2000,
    rating: 4.9,
    imageUrl: 'https://via.placeholder.com/150',
    phone: '+91-9876543214',
    email: 'dr.vikram@aiims.com',
  },
];

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Rahul Verma',
    age: 35,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91-9123456789',
    email: 'rahul.verma@email.com',
    address: '123, MG Road, Delhi - 110001',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin'],
    currentMedications: ['Metformin 500mg', 'Amlodipine 5mg'],
  },
  {
    id: '2',
    name: 'Anjali Desai',
    age: 28,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+91-9123456790',
    email: 'anjali.desai@email.com',
    address: '456, Park Street, Mumbai - 400001',
    medicalHistory: ['Asthma'],
    allergies: ['Dust', 'Pollen'],
    currentMedications: ['Salbutamol Inhaler'],
  },
  {
    id: '3',
    name: 'Karthik Nair',
    age: 42,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+91-9123456791',
    email: 'karthik.nair@email.com',
    address: '789, Brigade Road, Bangalore - 560001',
    medicalHistory: ['Coronary Artery Disease'],
    allergies: [],
    currentMedications: ['Aspirin 75mg', 'Atorvastatin 20mg'],
  },
  {
    id: '4',
    name: 'Meera Iyer',
    age: 55,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '+91-9123456792',
    email: 'meera.iyer@email.com',
    address: '321, Anna Salai, Chennai - 600001',
    medicalHistory: ['Osteoarthritis', 'Hypothyroidism'],
    allergies: ['Sulfa drugs'],
    currentMedications: ['Levothyroxine 50mcg', 'Glucosamine'],
  },
];

export const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    manufacturer: 'Cipla Ltd.',
    category: 'Analgesic',
    dosageForm: 'Tablet',
    strength: '500mg',
    price: 20,
    inStock: true,
    description: 'Used for pain relief and fever reduction',
    sideEffects: ['Nausea', 'Allergic reactions (rare)'],
    prescriptionRequired: false,
  },
  {
    id: '2',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    manufacturer: 'Sun Pharma',
    category: 'Antibiotic',
    dosageForm: 'Capsule',
    strength: '250mg',
    price: 150,
    inStock: true,
    description: 'Antibiotic used to treat bacterial infections',
    sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
    prescriptionRequired: true,
  },
  {
    id: '3',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    manufacturer: 'Dr. Reddy\'s',
    category: 'Antidiabetic',
    dosageForm: 'Tablet',
    strength: '500mg',
    price: 80,
    inStock: true,
    description: 'Used to control blood sugar in type 2 diabetes',
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
    prescriptionRequired: true,
  },
  {
    id: '4',
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    manufacturer: 'Lupin Ltd.',
    category: 'Antihypertensive',
    dosageForm: 'Tablet',
    strength: '5mg',
    price: 100,
    inStock: true,
    description: 'Used to treat high blood pressure and chest pain',
    sideEffects: ['Swelling of ankles', 'Dizziness', 'Flushing'],
    prescriptionRequired: true,
  },
  {
    id: '5',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    manufacturer: 'Torrent Pharma',
    category: 'Proton Pump Inhibitor',
    dosageForm: 'Capsule',
    strength: '20mg',
    price: 120,
    inStock: true,
    description: 'Used to treat acid reflux and stomach ulcers',
    sideEffects: ['Headache', 'Nausea', 'Diarrhea'],
    prescriptionRequired: false,
  },
  {
    id: '6',
    name: 'Cough Syrup',
    genericName: 'Dextromethorphan',
    manufacturer: 'Dabur India',
    category: 'Antitussive',
    dosageForm: 'Syrup',
    strength: '100ml',
    price: 85,
    inStock: true,
    description: 'Relief from dry cough',
    sideEffects: ['Drowsiness', 'Dizziness'],
    prescriptionRequired: false,
  },
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Understanding Diabetes: Prevention and Management',
    summary: 'A comprehensive guide to managing diabetes through diet, exercise, and medication in the Indian context.',
    content: `Diabetes is one of the fastest-growing health concerns in India. With over 77 million diabetics, India is often called the diabetes capital of the world.
    
**Prevention Strategies:**
- Maintain a healthy weight
- Regular physical activity (30 minutes daily)
- Balanced diet rich in whole grains, vegetables
- Limit sugar and refined carbohydrates
- Regular health check-ups after age 30

**Management Tips:**
- Monitor blood glucose regularly
- Take medications as prescribed
- Follow a diabetic-friendly diet
- Stay hydrated
- Manage stress through yoga and meditation

**Indian Diet Recommendations:**
- Replace white rice with brown rice or millets
- Include plenty of vegetables like bitter gourd, fenugreek
- Use whole wheat rotis instead of white bread
- Limit sweets and fried foods`,
    author: 'Dr. Rajesh Kumar',
    category: 'Nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400',
    publishDate: '2024-10-01',
    readTime: 5,
    tags: ['diabetes', 'prevention', 'diet'],
    externalUrl: 'https://www.who.int/health-topics/diabetes',
  },
  {
    id: '2',
    title: 'Heart Health: Tips for a Healthy Cardiovascular System',
    summary: 'Essential guidelines for maintaining heart health and preventing cardiovascular diseases.',
    content: `Cardiovascular diseases are the leading cause of death in India. Here's how to keep your heart healthy.

**Risk Factors:**
- High blood pressure
- High cholesterol
- Smoking
- Obesity
- Sedentary lifestyle
- Family history

**Prevention Measures:**
- Regular exercise (walking, jogging, swimming)
- Heart-healthy diet low in saturated fats
- Quit smoking and limit alcohol
- Manage stress
- Regular blood pressure and cholesterol checks

**Indian Dietary Tips:**
- Use mustard oil or olive oil for cooking
- Include garlic, onions, and turmeric
- Eat almonds and walnuts
- Consume fish rich in omega-3 (if non-vegetarian)
- Reduce salt intake`,
    author: 'Dr. Priya Sharma',
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400',
    publishDate: '2024-09-25',
    readTime: 6,
    tags: ['heart', 'cardiology', 'exercise'],
    externalUrl: 'https://www.heart.org/en/healthy-living',
  },
  {
    id: '3',
    title: 'Mental Health Awareness: Breaking the Stigma',
    summary: 'Understanding mental health issues and the importance of seeking help in Indian society.',
    content: `Mental health is as important as physical health, yet it remains stigmatized in Indian society.

**Common Mental Health Issues:**
- Depression
- Anxiety disorders
- Stress-related disorders
- Post-traumatic stress disorder (PTSD)

**Warning Signs:**
- Persistent sadness or anxiety
- Social withdrawal
- Changes in sleep or appetite
- Difficulty concentrating
- Thoughts of self-harm

**Seeking Help:**
- Talk to a mental health professional
- Join support groups
- Practice mindfulness and meditation
- Maintain social connections
- Exercise regularly

**Resources in India:**
- NIMHANS (Bangalore)
- Vandrevala Foundation Helpline
- iCall - Psychological Helpline
- Local counseling centers`,
    author: 'Dr. Vikram Singh',
    category: 'Mental Health',
    imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400',
    publishDate: '2024-09-20',
    readTime: 7,
    tags: ['mental health', 'awareness', 'wellbeing'],
    externalUrl: 'https://www.nimhans.ac.in/mental-health',
  },
  {
    id: '4',
    title: 'Nutrition for Children: Building Healthy Habits',
    summary: 'A guide for parents on ensuring proper nutrition for growing children.',
    content: `Proper nutrition during childhood is crucial for physical and mental development.

**Essential Nutrients:**
- Proteins (dal, eggs, dairy, nuts)
- Calcium (milk, paneer, ragi)
- Iron (green leafy vegetables, jaggery)
- Vitamins (fruits and vegetables)
- Healthy fats (ghee, nuts, seeds)

**Healthy Indian Food Options:**
- Idli, dosa with sambhar
- Vegetable pulao with raita
- Dal-roti with vegetables
- Poha with peanuts
- Fruits like banana, apple, mango

**Tips for Parents:**
- Involve children in meal planning
- Make food colorful and attractive
- Limit junk food and sugary drinks
- Ensure regular meal times
- Lead by example`,
    author: 'Dr. Sneha Reddy',
    category: 'Nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400',
    publishDate: '2024-09-15',
    readTime: 4,
    tags: ['nutrition', 'children', 'diet'],
    externalUrl: 'https://www.who.int/nutrition',
  },
  {
    id: '5',
    title: 'Yoga and Meditation: Ancient Practices for Modern Health',
    summary: 'Exploring the benefits of yoga and meditation for physical and mental wellbeing.',
    content: `Yoga and meditation are India's gift to the world for holistic health.

**Benefits of Yoga:**
- Improves flexibility and strength
- Reduces stress and anxiety
- Better cardiovascular health
- Enhanced mental clarity
- Pain management

**Common Yoga Asanas:**
- Surya Namaskar (Sun Salutation)
- Pranayama (Breathing exercises)
- Trikonasana (Triangle pose)
- Bhujangasana (Cobra pose)
- Shavasana (Corpse pose)

**Meditation Benefits:**
- Reduces stress and anxiety
- Improves focus and concentration
- Better emotional health
- Enhances self-awareness
- May reduce age-related memory loss

**Getting Started:**
- Start with 10-15 minutes daily
- Find a quiet, comfortable space
- Use guided meditation apps
- Join a local yoga class
- Be consistent`,
    author: 'Dr. Amit Patel',
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    publishDate: '2024-09-10',
    readTime: 5,
    tags: ['yoga', 'meditation', 'wellness'],
    externalUrl: 'https://www.yogajournal.com/yoga-101/',
  },
];

export const mockLabReports: LabReport[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Rahul Verma',
    reportType: 'Blood Sugar Test',
    date: '2024-10-10',
    fileUri: 'mock-uri-1',
    fileName: 'blood_sugar_report.pdf',
    fileType: 'pdf',
    notes: 'Fasting glucose: 110 mg/dL',
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'Rahul Verma',
    reportType: 'Lipid Profile',
    date: '2024-09-15',
    fileUri: 'mock-uri-2',
    fileName: 'lipid_profile.pdf',
    fileType: 'pdf',
    notes: 'Total cholesterol: 200 mg/dL',
  },
  {
    id: '3',
    patientId: '2',
    patientName: 'Anjali Desai',
    reportType: 'Chest X-Ray',
    date: '2024-10-05',
    fileUri: 'mock-uri-3',
    fileName: 'chest_xray.jpg',
    fileType: 'image',
    notes: 'Normal findings',
  },
];
