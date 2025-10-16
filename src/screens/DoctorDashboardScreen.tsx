import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Surface, IconButton, Chip, Avatar, ActivityIndicator, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getAppointmentsByDoctor, getTodayAppointmentsByDoctor, getDoctorById, getDoctorByEmail, getDoctorPatients } from '../api/firebaseServices';
import { Appointment, Doctor, Patient } from '../types';

const DoctorDashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    inProgress: 0,
  });

  useEffect(() => {
    console.log('Doctor Dashboard - User data:', user);
    console.log('Doctor Dashboard - User role:', user?.role);
    console.log('Doctor Dashboard - User doctorId:', user?.doctorId);
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) {
      console.warn('No user found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let doctorId = user.doctorId;
      let profile = null;

      // If doctorId is not available, try to find doctor by email
      if (!doctorId && user.email) {
        console.log('Attempting to find doctor by email:', user.email);
        profile = await getDoctorByEmail(user.email);
        if (profile) {
          doctorId = profile.id;
          console.log('Found doctor profile by email:', profile);
        }
      } else if (doctorId) {
        // Load doctor profile using doctorId
        profile = await getDoctorById(doctorId);
      }

      if (!doctorId) {
        console.warn('No doctorId found and unable to find doctor by email');
        setLoading(false);
        return;
      }

      setDoctorProfile(profile);

      // Load today's appointments
      const today = await getTodayAppointmentsByDoctor(doctorId);
      setTodayAppointments(today);

      // Load all appointments for stats
      const allAppointments = await getAppointmentsByDoctor(doctorId);
      setStats({
        total: allAppointments.length,
        scheduled: allAppointments.filter(a => a.status === 'scheduled').length,
        completed: allAppointments.filter(a => a.status === 'completed').length,
        inProgress: allAppointments.filter(a => a.status === 'in-progress').length,
      });

      // Load total patients
      const patients = await getDoctorPatients(doctorId);
      setTotalPatients(patients.length);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return 'calendar-clock';
      case 'in-progress': return 'stethoscope';
      case 'completed': return 'check-circle';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorText}>User not found</Text>
        <Text style={styles.errorSubText}>
          Please log in again.
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back,</Text>
            <Text style={styles.doctorName}>Dr. {doctorProfile?.name || user?.name}</Text>
            <Text style={styles.specialization}>{doctorProfile?.specialization}</Text>
          </View>
          <Avatar.Icon size={60} icon="doctor" style={styles.avatar} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Surface style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-check" size={32} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.scheduled}</Text>
            <Text style={styles.statLabel}>Scheduled</Text>
          </Surface>
          
          <Surface style={styles.statCard}>
            <MaterialCommunityIcons name="stethoscope" size={32} color="#FF9800" />
            <Text style={styles.statNumber}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </Surface>
          
          <Surface style={styles.statCard}>
            <MaterialCommunityIcons name="account-group" size={32} color="#4CAF50" />
            <Text style={styles.statNumber}>{totalPatients}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
          </Surface>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('DoctorAppointments')}
            >
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.actionGradient}
              >
                <MaterialCommunityIcons name="calendar-month" size={32} color="#fff" />
                <Text style={styles.actionText}>Appointments</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('DoctorPatients')}
            >
              <LinearGradient
                colors={['#4CAF50', '#388E3C']}
                style={styles.actionGradient}
              >
                <MaterialCommunityIcons name="account-multiple" size={32} color="#fff" />
                <Text style={styles.actionText}>My Patients</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('DoctorReports')}
            >
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                style={styles.actionGradient}
              >
                <MaterialCommunityIcons name="file-document" size={32} color="#fff" />
                <Text style={styles.actionText}>Lab Reports</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                const doctorId = user?.doctorId || doctorProfile?.id;
                if (doctorId) {
                  navigation.navigate('DoctorProfile', { doctorId });
                } else {
                  console.warn('Doctor ID not found. User:', user, 'Profile:', doctorProfile);
                  Alert.alert('Error', 'Unable to load profile. Doctor ID not found.');
                }
              }}
            >
              <LinearGradient
                colors={['#9C27B0', '#7B1FA2']}
                style={styles.actionGradient}
              >
                <MaterialCommunityIcons name="account-cog" size={32} color="#fff" />
                <Text style={styles.actionText}>My Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <Text style={styles.appointmentCount}>{todayAppointments.length}</Text>
          </View>

          {todayAppointments.length === 0 ? (
            <Surface style={styles.emptyCard}>
              <MaterialCommunityIcons name="calendar-check" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No appointments today</Text>
            </Surface>
          ) : (
            todayAppointments.map((appointment) => (
              <TouchableOpacity
                key={appointment.id}
                onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: appointment.id })}
              >
                <Card style={styles.appointmentCard}>
                  <View style={styles.appointmentContent}>
                    <View style={styles.appointmentTime}>
                      <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                      <Text style={styles.timeText}>{appointment.appointmentTime}</Text>
                    </View>
                    
                    <View style={styles.appointmentDetails}>
                      <View style={styles.patientInfo}>
                        <Avatar.Icon size={40} icon="account" style={styles.patientAvatar} />
                        <View style={styles.patientText}>
                          <Text style={styles.patientName}>{appointment.patientName}</Text>
                          <Text style={styles.patientMeta}>
                            {appointment.patientAge}y • {appointment.patientGender}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.appointmentMeta}>
                        <Chip
                          icon={getStatusIcon(appointment.status)}
                          style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) + '20' }]}
                          textStyle={[styles.statusText, { color: getStatusColor(appointment.status) }]}
                        >
                          {appointment.status}
                        </Chip>
                        
                        <Chip
                          icon="note-text"
                          style={styles.typeChip}
                          textStyle={styles.typeText}
                        >
                          {appointment.type}
                        </Chip>
                      </View>

                      {appointment.symptoms && (
                        <View style={styles.symptomsContainer}>
                          <MaterialCommunityIcons name="stethoscope" size={16} color="#666" />
                          <Text style={styles.symptomsText} numberOfLines={2}>
                            {appointment.symptoms}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  doctorName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  specialization: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    backgroundColor: '#fff',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  appointmentCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  actionCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyCard: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  appointmentCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  appointmentContent: {
    padding: 16,
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  appointmentDetails: {
    gap: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  patientAvatar: {
    backgroundColor: '#E3F2FD',
  },
  patientText: {
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
    marginTop: 2,
  },
  appointmentMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  typeChip: {
    height: 28,
    backgroundColor: '#f5f5f5',
  },
  typeText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  symptomsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  symptomsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DoctorDashboardScreen;
