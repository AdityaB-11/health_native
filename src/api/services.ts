// Import Firebase services
import {
  getDoctors as getFirebaseDoctors,
  getDoctorById as getFirebaseDoctorById,
  addDoctor,
  getPatients as getFirebasePatients,
  getPatientById as getFirebasePatientById,
  getMedicines as getFirebaseMedicines,
  getMedicineById as getFirebaseMedicineById,
  addMedicine,
  getArticles as getFirebaseArticles,
  getArticleById as getFirebaseArticleById,
  addArticle,
  getLabReports as getFirebaseLabReports,
  getLabReportsByPatient,
  getLabReportById as getFirebaseLabReportById,
  addLabReport,
  addAppointment,
} from './firebaseServices';
import { Doctor, Patient, Medicine, Article, LabReport, Appointment } from '../types';

// Doctors API
export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    return await getFirebaseDoctors();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

export const getDoctorById = async (id: string): Promise<Doctor> => {
  const doctor = await getFirebaseDoctorById(id);
  if (!doctor) {
    throw new Error('Doctor not found');
  }
  return doctor;
};

export { addDoctor };

// Patients API
export const getPatients = async (): Promise<Patient[]> => {
  try {
    return await getFirebasePatients();
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};

export const getPatientById = async (id: string): Promise<Patient> => {
  const patient = await getFirebasePatientById(id);
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient;
};

// Medicines API
export const getMedicines = async (): Promise<Medicine[]> => {
  try {
    return await getFirebaseMedicines();
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return [];
  }
};

export const getMedicineById = async (id: string): Promise<Medicine> => {
  const medicine = await getFirebaseMedicineById(id);
  if (!medicine) {
    throw new Error('Medicine not found');
  }
  return medicine;
};

export { addMedicine };

// Articles API
export const getArticles = async (): Promise<Article[]> => {
  try {
    return await getFirebaseArticles();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

export const getArticleById = async (id: string): Promise<Article> => {
  const article = await getFirebaseArticleById(id);
  if (!article) {
    throw new Error('Article not found');
  }
  return article;
};

export { addArticle };

// Lab Reports API
export const getLabReports = async (patientId?: string): Promise<LabReport[]> => {
  try {
    if (patientId) {
      return await getLabReportsByPatient(patientId);
    }
    return await getFirebaseLabReports();
  } catch (error) {
    console.error('Error fetching lab reports:', error);
    return [];
  }
};

export const uploadLabReport = async (report: Omit<LabReport, 'id'>): Promise<LabReport> => {
  const reportId = await addLabReport(report);
  const savedReport = await getFirebaseLabReportById(reportId);
  if (!savedReport) {
    throw new Error('Failed to retrieve saved lab report');
  }
  return savedReport;
};

// Appointments API
export const bookAppointment = async (appointmentData: Omit<Appointment, 'id'>): Promise<string> => {
  try {
    return await addAppointment(appointmentData);
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw new Error('Failed to book appointment');
  }
};


