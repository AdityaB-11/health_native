import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, Avatar, ActivityIndicator, Chip, Divider, List } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getPatientById, getAppointmentsByPatient, getPatientReportsByDoctor } from '../api/firebaseServices';
import { Patient, Appointment, LabReport } from '../types';
import { formatDate } from '../utils/dateUtils';

const DoctorPatientDetailScreen = ({ route, navigation }: any) => {
  const { patientId } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    if (!user?.doctorId) return;

    try {
      setLoading(true);
      const [patientData, appointmentsData, reportsData] = await Promise.all([
        getPatientById(patientId),
        getAppointmentsByPatient(patientId),
        getPatientReportsByDoctor(user.doctorId, patientId),
      ]);

      setPatient(patientData);
      
      // Debug patient data structure
      console.log('🔍 Patient data loaded:', {
        name: patientData?.name,
        allergies: patientData?.allergies,
        allergiesType: typeof patientData?.allergies,
        medicalHistory: patientData?.medicalHistory,
        medicalHistoryType: typeof patientData?.medicalHistory,
        currentMedications: patientData?.currentMedications,
        currentMedicationsType: typeof patientData?.currentMedications
      });
      
      // Filter appointments for this doctor only
      const doctorAppointments = appointmentsData.filter(apt => apt.doctorId === user.doctorId);
      setAppointments(doctorAppointments);
      
      setLabReports(reportsData);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPatientData();
  };

  // Helper function to safely convert data to array
  const safeArrayFromData = (data: any): string[] => {
    if (Array.isArray(data)) {
      return data;
    }
    if (typeof data === 'string' && data.trim()) {
      return data.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    return [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#2196F3';
      case 'in-progress': return '#FF9800';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[
          patient.gender === 'Male' ? '#2196F3' : patient.gender === 'Female' ? '#E91E63' : '#9C27B0',
          patient.gender === 'Male' ? '#1976D2' : patient.gender === 'Female' ? '#C2185B' : '#7B1FA2',
        ]}
        style={styles.header}
      >
        <Avatar.Text
          size={80}
          label={patient.name.substring(0, 2).toUpperCase()}
          style={styles.avatar}
        />
        <Text style={styles.patientName}>{patient.name}</Text>
        <Text style={styles.patientMeta}>
          {patient.age} years • {patient.gender} • {patient.bloodGroup}
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Contact Information */}
        <Card style={styles.card}>
          <Card.Title
            title="Contact Information"
            left={(props) => <MaterialCommunityIcons name="card-account-details" {...props} color="#2196F3" />}
          />
          <Card.Content>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons name="phone" size={20} color="#666" />
              <Text style={styles.contactText}>{patient.phone}</Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons name="email" size={20} color="#666" />
              <Text style={styles.contactText}>{patient.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
              <Text style={styles.contactText}>{patient.address}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Medical Alerts */}
        {safeArrayFromData(patient.allergies).length > 0 && (
          <Card style={[styles.card, styles.alertCard]}>
            <Card.Title
              title="Allergies"
              left={(props) => <MaterialCommunityIcons name="alert-circle" {...props} color="#F44336" />}
              titleStyle={{ color: '#F44336' }}
            />
            <Card.Content>
              <View style={styles.chipsContainer}>
                {safeArrayFromData(patient.allergies).map((allergy, index) => (
                  <Chip
                    key={index}
                    icon="alert"
                    style={styles.allergyChip}
                    textStyle={styles.allergyText}
                  >
                    {allergy}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Current Medications */}
        {safeArrayFromData(patient.currentMedications).length > 0 && (
          <Card style={styles.card}>
            <Card.Title
              title="Current Medications"
              left={(props) => <MaterialCommunityIcons name="pill" {...props} color="#FF9800" />}
            />
            <Card.Content>
              {safeArrayFromData(patient.currentMedications).map((medication, index) => (
                <View key={index} style={styles.medicationRow}>
                  <MaterialCommunityIcons name="checkbox-marked-circle" size={20} color="#4CAF50" />
                  <Text style={styles.medicationText}>{medication}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Medical History */}
        {safeArrayFromData(patient.medicalHistory).length > 0 && (
          <Card style={styles.card}>
            <Card.Title
              title="Medical History"
              left={(props) => <MaterialCommunityIcons name="file-document" {...props} color="#9C27B0" />}
            />
            <Card.Content>
              {safeArrayFromData(patient.medicalHistory).map((history, index) => (
                <View key={index} style={styles.historyRow}>
                  <MaterialCommunityIcons name="circle-medium" size={20} color="#9C27B0" />
                  <Text style={styles.historyText}>{history}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Appointment History */}
        <Card style={styles.card}>
          <Card.Title
            title={`Appointment History (${(appointments || []).length})`}
            left={(props) => <MaterialCommunityIcons name="calendar-multiple" {...props} color="#2196F3" />}
          />
          <Card.Content>
            {(appointments || []).length === 0 ? (
              <Text style={styles.emptyText}>No appointments yet</Text>
            ) : (
              (appointments || []).slice(0, 5).map((appointment) => (
                <TouchableOpacity
                  key={appointment.id}
                  onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: appointment.id })}
                >
                  <Surface style={styles.appointmentItem}>
                    <View style={styles.appointmentHeader}>
                      <Text style={styles.appointmentDate}>
                        {formatDate(appointment.appointmentDate)}
                      </Text>
                      <Chip
                        icon={appointment.status === 'completed' ? 'check-circle' : 'clock-outline'}
                        style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) + '20' }]}
                        textStyle={[styles.statusText, { color: getStatusColor(appointment.status) }]}
                      >
                        {appointment.status}
                      </Chip>
                    </View>
                    {appointment.diagnosis && (
                      <Text style={styles.diagnosisText} numberOfLines={2}>
                        {appointment.diagnosis}
                      </Text>
                    )}
                  </Surface>
                </TouchableOpacity>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Lab Reports */}
        <Card style={styles.card}>
          <Card.Title
            title={`Lab Reports (${(labReports || []).length})`}
            left={(props) => <MaterialCommunityIcons name="file-chart" {...props} color="#FF9800" />}
          />
          <Card.Content>
            {(labReports || []).length === 0 ? (
              <Text style={styles.emptyText}>No lab reports available</Text>
            ) : (
              (labReports || []).map((report) => (
                <Surface key={report.id} style={styles.reportItem}>
                  <View style={styles.reportHeader}>
                    <MaterialCommunityIcons name="file-document" size={24} color="#FF9800" />
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportType}>{report.reportType}</Text>
                      <Text style={styles.reportDate}>
                        {formatDate(report.date)}
                      </Text>
                    </View>
                  </View>
                </Surface>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* Book Appointment Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookAppointment', { 
            patientId: patient?.id,
            patientName: patient?.name,
            doctorId: user?.doctorId 
          })}
        >
          <LinearGradient
            colors={['#4CAF50', '#388E3C']}
            style={styles.buttonGradient}
          >
            <MaterialCommunityIcons name="calendar-plus" size={24} color="#fff" />
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 100, // Space for the floating button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    marginTop: 12,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 16,
  },
  patientName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  patientMeta: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  alertCard: {
    borderWidth: 2,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#1a1a1a',
    flex: 1,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyChip: {
    backgroundColor: '#F44336',
  },
  allergyText: {
    color: '#fff',
    fontWeight: '600',
  },
  medicationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  medicationText: {
    fontSize: 15,
    color: '#1a1a1a',
    flex: 1,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  historyText: {
    fontSize: 15,
    color: '#1a1a1a',
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  appointmentItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  diagnosisText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  reportItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reportDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DoctorPatientDetailScreen;
