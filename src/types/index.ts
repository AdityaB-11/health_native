export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
  token?: string;
  doctorId?: string; // Link to doctor profile if role is 'doctor'
  patientId?: string; // Link to patient profile if role is 'patient'
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  hospital: string;
  location: string;
  availability: string;
  consultationFee: number;
  rating: number;
  imageUrl: string;
  phone: string;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  dosageForm: string;
  strength: string;
  price: number;
  inStock: boolean;
  description: string;
  sideEffects: string[];
  prescriptionRequired: boolean;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  reportType: string;
  date: string;
  fileUri: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  notes?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
  publishDate: string;
  readTime: number;
  tags: string[];
  externalUrl?: string; // Optional link to full article
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  type: 'consultation' | 'follow-up' | 'emergency';
  symptoms: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
}
