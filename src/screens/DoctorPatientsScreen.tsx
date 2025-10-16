import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, Searchbar, Avatar, ActivityIndicator, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getDoctorPatients, getAppointmentsByDoctor, getDoctorByEmail, getPatientById, getPatients } from '../api/firebaseServices';
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
    if (!user) {
      console.log('❌ No user found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let doctorId = user.doctorId;
      
      console.log('🔍 Loading patients for user:', { 
        userId: user.id, 
        userRole: user.role, 
        userDoctorId: user.doctorId,
        userEmail: user.email 
      });

      // If no doctorId, try to find doctor by email
      if (!doctorId && user.email) {
        console.log('🔍 No doctorId found, searching by email:', user.email);
        const doctorProfile = await getDoctorByEmail(user.email);
        if (doctorProfile) {
          doctorId = doctorProfile.id;
          console.log('✅ Found doctor profile by email:', doctorProfile.id);
        }
      }

      if (!doctorId) {
        console.log('❌ No doctorId found, cannot load patients');
        setLoading(false);
        return;
      }
      
      console.log('🔍 Loading data for doctorId:', doctorId);
      
      const [appointmentsData] = await Promise.all([
        getAppointmentsByDoctor(doctorId),
      ]);
      
      console.log('📊 Appointments found:', appointmentsData.length);
      console.log('📊 Appointment details:', appointmentsData.map(apt => ({ 
        id: apt.id, 
        doctorId: apt.doctorId, 
        patientId: apt.patientId, 
        patientName: apt.patientName 
      })));

      // Get unique patient IDs from appointments
      const patientIdsWithAppointments = [...new Set(appointmentsData.map(apt => apt.patientId))];
      console.log('👥 Unique patient IDs:', patientIdsWithAppointments);

      // Fetch patient details for each patient ID
      const patientsWithAppointments: Patient[] = [];
      for (const patientId of patientIdsWithAppointments) {
        try {
          const patient = await getPatientById(patientId);
          if (patient) {
            patientsWithAppointments.push(patient);
            console.log('✅ Loaded patient:', patient.name);
          } else {
            console.log('❌ Patient not found for ID:', patientId);
          }
        } catch (error) {
          console.log('❌ Error loading patient:', patientId, error);
        }
      }
      
      console.log('🎯 Final results:');
      console.log('- Patients with appointments:', patientsWithAppointments.length);
      
      // If no patients with appointments found, show all patients for debugging
      if (patientsWithAppointments.length === 0) {
        console.log('⚠️ No patients with appointments found. Checking all patients for debugging...');
        try {
          const allPatients = await getPatients();
          console.log('📊 All patients in system:', allPatients.length);
          console.log('📊 All patients:', allPatients.map(p => ({ id: p.id, name: p.name, email: p.email })));
          
          // Temporarily show all patients so user can see what's available
          setPatients(allPatients);
          setFilteredPatients(allPatients);
        } catch (error) {
          console.log('❌ Error loading all patients:', error);
        }
      } else {
        setPatients(patientsWithAppointments);
        setFilteredPatients(patientsWithAppointments);
      }
      
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('❌ Error loading patients:', error);
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
    return (appointments || []).filter(apt => apt.patientId === patientId).length;
  };

  const getLastAppointment = (patientId: string) => {
    const patientAppointments = (appointments || [])
      .filter(apt => apt.patientId === patientId)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    
    return patientAppointments[0];
  };

  const getNextAppointment = (patientId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureAppointments = (appointments || [])
      .filter(apt => 
        apt.patientId === patientId && 
        new Date(apt.appointmentDate) >= today &&
        apt.status === 'scheduled'
      )
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    
    return futureAppointments[0];
  };

  const getCompletedAppointments = (patientId: string) => {
    return (appointments || []).filter(apt => 
      apt.patientId === patientId && 
      apt.status === 'completed'
    ).length;
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
          <Text style={styles.headerSubtitle}>{(filteredPatients || []).length} patients with appointments</Text>
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
        {(filteredPatients || []).length === 0 ? (
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
            const nextAppointment = getNextAppointment(patient.id);
            const completedCount = getCompletedAppointments(patient.id);

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

                    {/* Enhanced Appointment Stats */}
                    <View style={styles.statsRow}>
                      <Surface style={styles.statBadge}>
                        <MaterialCommunityIcons name="calendar-multiple" size={18} color="#4CAF50" />
                        <Text style={styles.statText}>{appointmentCount} total</Text>
                      </Surface>
                      
                      <Surface style={styles.statBadge}>
                        <MaterialCommunityIcons name="check-circle" size={18} color="#4CAF50" />
                        <Text style={styles.statText}>{completedCount} completed</Text>
                      </Surface>
                    </View>

                    {/* Latest Appointment Info */}
                    <View style={styles.appointmentInfo}>
                      {lastAppointment && (
                        <View style={styles.appointmentRow}>
                          <MaterialCommunityIcons name="clock-outline" size={16} color="#FF9800" />
                          <Text style={styles.appointmentText}>
                            Last visit: {new Date(lastAppointment.appointmentDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Text>
                        </View>
                      )}
                      
                      {nextAppointment && (
                        <View style={styles.appointmentRow}>
                          <MaterialCommunityIcons name="calendar-clock" size={16} color="#2196F3" />
                          <Text style={styles.appointmentText}>
                            Next: {new Date(nextAppointment.appointmentDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })} at {nextAppointment.appointmentTime}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Medical Highlights */}
                    {((patient.allergies || []).length > 0 || (patient.medicalHistory || []).length > 0) && (
                      <View style={styles.medicalInfo}>
                        {(patient.allergies || []).length > 0 && (
                          <View style={styles.allergyContainer}>
                            <MaterialCommunityIcons name="alert-circle" size={16} color="#F44336" />
                            <Text style={styles.allergyText}>
                              Allergies: {(patient.allergies || []).slice(0, 2).join(', ')}
                              {(patient.allergies || []).length > 2 && ` +${(patient.allergies || []).length - 2}`}
                            </Text>
                          </View>
                        )}
                        
                        {(patient.medicalHistory || []).length > 0 && (
                          <View style={styles.historyContainer}>
                            <MaterialCommunityIcons name="file-document" size={16} color="#2196F3" />
                            <Text style={styles.historyText} numberOfLines={1}>
                              {(patient.medicalHistory || [])[0]}
                              {(patient.medicalHistory || []).length > 1 && ` +${(patient.medicalHistory || []).length - 1} more`}
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
  appointmentInfo: {
    gap: 6,
    paddingTop: 8,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appointmentText: {
    fontSize: 12,
    color: '#666',
  },
});

export default DoctorPatientsScreen;
