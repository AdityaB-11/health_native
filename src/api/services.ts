import apiClient from './apiClient';
import { mockDoctors, mockPatients, mockMedicines, mockArticles, mockLabReports } from './mockData';
import { Doctor, Patient, Medicine, Article, LabReport } from '../types';

// Mock mode flag - set to false when backend is ready
const USE_MOCK_DATA = true;

// Doctors API
export const getDoctors = async (): Promise<Doctor[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => setTimeout(() => resolve(mockDoctors), 500));
  }
  const response = await apiClient.get('/doctors');
  return response.data;
};

export const getDoctorById = async (id: string): Promise<Doctor> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const doctor = mockDoctors.find(d => d.id === id);
      setTimeout(() => resolve(doctor!), 300);
    });
  }
  const response = await apiClient.get(`/doctors/${id}`);
  return response.data;
};

export const addDoctor = async (doctor: Omit<Doctor, 'id'>): Promise<Doctor> => {
  if (USE_MOCK_DATA) {
    const newDoctor = { ...doctor, id: String(mockDoctors.length + 1) };
    mockDoctors.push(newDoctor);
    return new Promise((resolve) => setTimeout(() => resolve(newDoctor), 500));
  }
  const response = await apiClient.post('/doctors', doctor);
  return response.data;
};

// Patients API
export const getPatients = async (): Promise<Patient[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => setTimeout(() => resolve(mockPatients), 500));
  }
  const response = await apiClient.get('/patients');
  return response.data;
};

export const getPatientById = async (id: string): Promise<Patient> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const patient = mockPatients.find(p => p.id === id);
      setTimeout(() => resolve(patient!), 300);
    });
  }
  const response = await apiClient.get(`/patients/${id}`);
  return response.data;
};

// Medicines API
export const getMedicines = async (): Promise<Medicine[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => setTimeout(() => resolve(mockMedicines), 500));
  }
  const response = await apiClient.get('/medicines');
  return response.data;
};

export const getMedicineById = async (id: string): Promise<Medicine> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const medicine = mockMedicines.find(m => m.id === id);
      setTimeout(() => resolve(medicine!), 300);
    });
  }
  const response = await apiClient.get(`/medicines/${id}`);
  return response.data;
};

export const addMedicine = async (medicine: Omit<Medicine, 'id'>): Promise<Medicine> => {
  if (USE_MOCK_DATA) {
    const newMedicine = { ...medicine, id: String(mockMedicines.length + 1) };
    mockMedicines.push(newMedicine);
    return new Promise((resolve) => setTimeout(() => resolve(newMedicine), 500));
  }
  const response = await apiClient.post('/medicines', medicine);
  return response.data;
};

// Articles API
export const getArticles = async (): Promise<Article[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => setTimeout(() => resolve(mockArticles), 500));
  }
  const response = await apiClient.get('/articles');
  return response.data;
};

export const getArticleById = async (id: string): Promise<Article> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const article = mockArticles.find(a => a.id === id);
      setTimeout(() => resolve(article!), 300);
    });
  }
  const response = await apiClient.get(`/articles/${id}`);
  return response.data;
};

export const addArticle = async (article: Omit<Article, 'id'>): Promise<Article> => {
  if (USE_MOCK_DATA) {
    const newArticle = { ...article, id: String(mockArticles.length + 1) };
    mockArticles.push(newArticle);
    return new Promise((resolve) => setTimeout(() => resolve(newArticle), 500));
  }
  const response = await apiClient.post('/articles', article);
  return response.data;
};

// Lab Reports API
export const getLabReports = async (patientId?: string): Promise<LabReport[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const reports = patientId 
        ? mockLabReports.filter(r => r.patientId === patientId)
        : mockLabReports;
      setTimeout(() => resolve(reports), 500);
    });
  }
  const url = patientId ? `/lab-reports?patientId=${patientId}` : '/lab-reports';
  const response = await apiClient.get(url);
  return response.data;
};

export const uploadLabReport = async (report: Omit<LabReport, 'id'>): Promise<LabReport> => {
  if (USE_MOCK_DATA) {
    const newReport = { ...report, id: String(mockLabReports.length + 1) };
    mockLabReports.push(newReport);
    return new Promise((resolve) => setTimeout(() => resolve(newReport), 500));
  }
  const response = await apiClient.post('/lab-reports', report);
  return response.data;
};
