import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, Searchbar, Avatar, ActivityIndicator, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getDoctorPatients, getAppointmentsByDoctor } from '../api/firebaseServices';
import { Patient, Appointment } from '../types';

const DoctorPatientsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    loadPatients();
  }, [user]);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    if (!user?.doctorId) return;

    try {
      setLoading(true);
      const [patientsData, appointmentsData] = await Promise.all([
        getDoctorPatients(user.doctorId),
        getAppointmentsByDoctor(user.doctorId),
      ]);
      
      setPatients(patientsData);
      setAppointments(appointmentsData);
      setFilteredPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterPatients = () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.phone.includes(query) ||
      patient.bloodGroup.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPatients();
  };

  const getPatientAppointmentCount = (patientId: string) => {
    return appointments.filter(apt => apt.patientId === patientId).length;
  };

  const getLastAppointment = (patientId: string) => {
    const patientAppointments = appointments
      .filter(apt => apt.patientId === patientId)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    
    return patientAppointments[0];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#388E3C']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Patients</Text>
          <Text style={styles.headerSubtitle}>{patients.length} Total Patients</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search patients..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          icon="account-search"
        />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredPatients.length === 0 ? (
          <Surface style={styles.emptyCard}>
            <MaterialCommunityIcons name="account-search" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No patients found' : 'No patients yet'}
            </Text>
          </Surface>
        ) : (
          filteredPatients.map((patient) => {
            const appointmentCount = getPatientAppointmentCount(patient.id);
            const lastAppointment = getLastAppointment(patient.id);

            return (
              <TouchableOpacity
                key={patient.id}
                onPress={() => navigation.navigate('DoctorPatientDetail', { patientId: patient.id })}
              >
                <Card style={styles.patientCard}>
                  <View style={styles.cardContent}>
                    {/* Patient Avatar & Basic Info */}
                    <View style={styles.patientHeader}>
                      <Avatar.Text
                        size={56}
                        label={patient.name.substring(0, 2).toUpperCase()}
                        style={[
                          styles.avatar,
                          { backgroundColor: patient.gender === 'Male' ? '#2196F3' : patient.gender === 'Female' ? '#E91E63' : '#9C27B0' }
                        ]}
                      />
                      <View style={styles.patientInfo}>
                        <Text style={styles.patientName}>{patient.name}</Text>
                        <Text style={styles.patientMeta}>
                          {patient.age}y • {patient.gender} • {patient.bloodGroup}
                        </Text>
                        <View style={styles.contactRow}>
                          <MaterialCommunityIcons name="phone" size={14} color="#666" />
                          <Text style={styles.contactText}>{patient.phone}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Appointment Stats */}
                    <View style={styles.statsRow}>
                      <Surface style={styles.statBadge}>
                        <MaterialCommunityIcons name="calendar-multiple" size={18} color="#4CAF50" />
                        <Text style={styles.statText}>{appointmentCount} visits</Text>
                      </Surface>
                      
                      {lastAppointment && (
                        <Surface style={styles.statBadge}>
                          <MaterialCommunityIcons name="clock-outline" size={18} color="#FF9800" />
                          <Text style={styles.statText}>
                            Last: {new Date(lastAppointment.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Text>
                        </Surface>
                      )}
                    </View>

                    {/* Medical Highlights */}
                    {(patient.allergies.length > 0 || patient.medicalHistory.length > 0) && (
                      <View style={styles.medicalInfo}>
                        {patient.allergies.length > 0 && (
                          <View style={styles.allergyContainer}>
                            <MaterialCommunityIcons name="alert-circle" size={16} color="#F44336" />
                            <Text style={styles.allergyText}>
                              Allergies: {patient.allergies.slice(0, 2).join(', ')}
                              {patient.allergies.length > 2 && ` +${patient.allergies.length - 2}`}
                            </Text>
                          </View>
                        )}
                        
                        {patient.medicalHistory.length > 0 && (
                          <View style={styles.historyContainer}>
                            <MaterialCommunityIcons name="file-document" size={16} color="#2196F3" />
                            <Text style={styles.historyText} numberOfLines={1}>
                              {patient.medicalHistory[0]}
                              {patient.medicalHistory.length > 1 && ` +${patient.medicalHistory.length - 1} more`}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Action Arrow */}
                    <View style={styles.arrowContainer}>
                      <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  searchContainer: {
    padding: 16,
    marginTop: -20,
  },
  searchBar: {
    elevation: 4,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  patientCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  cardContent: {
    padding: 16,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  patientMeta: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  contactText: {
    fontSize: 13,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  medicalInfo: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  allergyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  allergyText: {
    flex: 1,
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
  },
  historyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  historyText: {
    flex: 1,
    fontSize: 12,
    color: '#2196F3',
  },
  arrowContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -12,
  },
});

export default DoctorPatientsScreen;
