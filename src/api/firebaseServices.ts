import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Doctor, Medicine, Article, Patient, LabReport, Appointment } from '../types';

// ==================== DOCTORS ====================

export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'doctors'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Doctor[];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  try {
    const docRef = doc(db, 'doctors', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Doctor;
    }
    return null;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    throw error;
  }
};

export const addDoctor = async (doctorData: Omit<Doctor, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'doctors'), {
      ...doctorData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding doctor:', error);
    throw error;
  }
};

export const updateDoctor = async (id: string, doctorData: Partial<Doctor>): Promise<void> => {
  try {
    const docRef = doc(db, 'doctors', id);
    await updateDoc(docRef, doctorData);
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

export const deleteDoctor = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'doctors', id));
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
};

// ==================== MEDICINES ====================

export const getMedicines = async (): Promise<Medicine[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'medicines'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Medicine[];
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
};

export const getMedicineById = async (id: string): Promise<Medicine | null> => {
  try {
    const docRef = doc(db, 'medicines', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Medicine;
    }
    return null;
  } catch (error) {
    console.error('Error fetching medicine:', error);
    throw error;
  }
};

export const addMedicine = async (medicineData: Omit<Medicine, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'medicines'), {
      ...medicineData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding medicine:', error);
    throw error;
  }
};

export const updateMedicine = async (id: string, medicineData: Partial<Medicine>): Promise<void> => {
  try {
    const docRef = doc(db, 'medicines', id);
    await updateDoc(docRef, medicineData);
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
};

export const deleteMedicine = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'medicines', id));
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
};

// ==================== ARTICLES ====================

export const getArticles = async (): Promise<Article[]> => {
  try {
    const q = query(collection(db, 'articles'), orderBy('publishedDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Article[];
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Article;
    }
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

export const addArticle = async (articleData: Omit<Article, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'articles'), {
      ...articleData,
      publishedDate: Timestamp.now(),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
};

export const updateArticle = async (id: string, articleData: Partial<Article>): Promise<void> => {
  try {
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, articleData);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'articles', id));
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

// ==================== PATIENTS ====================

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'patients'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Patient[];
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const docRef = doc(db, 'patients', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Patient;
    }
    return null;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};

export const addPatient = async (patientData: Omit<Patient, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'patients'), {
      ...patientData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error;
  }
};

export const updatePatient = async (id: string, patientData: Partial<Patient>): Promise<void> => {
  try {
    const docRef = doc(db, 'patients', id);
    await updateDoc(docRef, patientData);
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

export const deletePatient = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'patients', id));
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

// ==================== LAB REPORTS ====================

export const getLabReports = async (): Promise<LabReport[]> => {
  try {
    const q = query(collection(db, 'labReports'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as LabReport[];
  } catch (error) {
    console.error('Error fetching lab reports:', error);
    throw error;
  }
};

export const getLabReportById = async (id: string): Promise<LabReport | null> => {
  try {
    const docRef = doc(db, 'labReports', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LabReport;
    }
    return null;
  } catch (error) {
    console.error('Error fetching lab report:', error);
    throw error;
  }
};

export const getLabReportsByPatient = async (patientId: string): Promise<LabReport[]> => {
  try {
    const q = query(
      collection(db, 'labReports'),
      where('patientId', '==', patientId)
    );
    const querySnapshot = await getDocs(q);
    const reports = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as LabReport[];
    
    // Sort by date in JavaScript (newest first)
    return reports.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error fetching patient lab reports:', error);
    throw error;
  }
};

export const addLabReport = async (reportData: Omit<LabReport, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'labReports'), {
      ...reportData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding lab report:', error);
    throw error;
  }
};

export const updateLabReport = async (id: string, reportData: Partial<LabReport>): Promise<void> => {
  try {
    const docRef = doc(db, 'labReports', id);
    await updateDoc(docRef, reportData);
  } catch (error) {
    console.error('Error updating lab report:', error);
    throw error;
  }
};

export const deleteLabReport = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'labReports', id));
  } catch (error) {
    console.error('Error deleting lab report:', error);
    throw error;
  }
};

// ==================== APPOINTMENTS ====================

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const q = query(collection(db, 'appointments'), orderBy('appointmentDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const docRef = doc(db, 'appointments', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Appointment;
    }
    return null;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

export const getAppointmentsByDoctor = async (doctorId: string): Promise<Appointment[]> => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('doctorId', '==', doctorId)
    );
    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
    
    // Sort by appointment date in JavaScript (newest first)
    return appointments.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    throw error;
  }
};

export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', patientId)
    );
    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
    
    // Sort by appointment date in JavaScript (newest first)
    return appointments.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    throw error;
  }
};

export const getTodayAppointmentsByDoctor = async (doctorId: string): Promise<Appointment[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'appointments'),
      where('doctorId', '==', doctorId),
      where('appointmentDate', '==', today)
    );
    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
    
    // Sort by appointment time in JavaScript (earliest first)
    return appointments.sort((a, b) => {
      const timeA = a.appointmentTime;
      const timeB = b.appointmentTime;
      return timeA.localeCompare(timeB);
    });
  } catch (error) {
    console.error('Error fetching today appointments:', error);
    throw error;
  }
};

export const addAppointment = async (appointmentData: Omit<Appointment, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding appointment:', error);
    throw error;
  }
};

export const updateAppointment = async (id: string, appointmentData: Partial<Appointment>): Promise<void> => {
  try {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, appointmentData);
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'appointments', id));
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// ==================== DOCTOR-SPECIFIC SERVICES ====================

export const getDoctorPatients = async (doctorId: string): Promise<Patient[]> => {
  try {
    // Get all appointments for this doctor
    const appointments = await getAppointmentsByDoctor(doctorId);
    
    // Get unique patient IDs
    const patientIds = [...new Set(appointments.map(apt => apt.patientId))];
    
    // Fetch patient details
    const patients: Patient[] = [];
    for (const patientId of patientIds) {
      const patient = await getPatientById(patientId);
      if (patient) {
        patients.push(patient);
      }
    }
    
    return patients;
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    throw error;
  }
};

export const getPatientReportsByDoctor = async (doctorId: string, patientId: string): Promise<LabReport[]> => {
  try {
    // Verify patient has appointments with this doctor
    const appointments = await getAppointmentsByDoctor(doctorId);
    const hasAppointment = appointments.some(apt => apt.patientId === patientId);
    
    if (!hasAppointment) {
      return []; // Doctor can only see reports of their patients
    }
    
    return await getLabReportsByPatient(patientId);
  } catch (error) {
    console.error('Error fetching patient reports:', error);
    throw error;
  }
};
