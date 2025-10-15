import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, Chip, Avatar, ActivityIndicator, FAB, SegmentedButtons } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getAppointmentsByDoctor } from '../api/firebaseServices';
import { Appointment } from '../types';

const DoctorAppointmentsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('all');
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadAppointments();
  }, [user]);

  useEffect(() => {
    filterAppointments();
  }, [filter, appointments]);

  const loadAppointments = async () => {
    if (!user?.doctorId) return;

    try {
      setLoading(true);
      const data = await getAppointmentsByDoctor(user.doctorId);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    switch (filter) {
      case 'today':
        const today = new Date().toISOString().split('T')[0];
        filtered = appointments.filter(apt => apt.appointmentDate === today);
        break;
      case 'upcoming':
        const now = new Date().toISOString().split('T')[0];
        filtered = appointments.filter(apt => 
          apt.appointmentDate >= now && apt.status === 'scheduled'
        );
        break;
      case 'completed':
        filtered = appointments.filter(apt => apt.status === 'completed');
        break;
      case 'all':
      default:
        filtered = appointments;
        break;
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateCompare = b.appointmentDate.localeCompare(a.appointmentDate);
      if (dateCompare !== 0) return dateCompare;
      return b.appointmentTime.localeCompare(a.appointmentTime);
    });

    setFilteredAppointments(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return '#2196F3';
      case 'follow-up': return '#4CAF50';
      case 'emergency': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
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
          <Text style={styles.headerTitle}>Appointments</Text>
          <Text style={styles.headerSubtitle}>{appointments.length} Total</Text>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'today', label: 'Today' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'completed', label: 'Done' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAppointments.length === 0 ? (
          <Surface style={styles.emptyCard}>
            <MaterialCommunityIcons name="calendar-blank" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No appointments found</Text>
          </Surface>
        ) : (
          filteredAppointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: appointment.id })}
            >
              <Card style={styles.appointmentCard}>
                <View style={styles.cardContent}>
                  {/* Date & Time Header */}
                  <View style={styles.dateTimeHeader}>
                    <View style={styles.dateContainer}>
                      <MaterialCommunityIcons name="calendar" size={20} color="#2196F3" />
                      <Text style={styles.dateText}>{formatDate(appointment.appointmentDate)}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <MaterialCommunityIcons name="clock-outline" size={20} color="#FF9800" />
                      <Text style={styles.timeText}>{appointment.appointmentTime}</Text>
                    </View>
                  </View>

                  {/* Patient Info */}
                  <View style={styles.patientSection}>
                    <Avatar.Text
                      size={48}
                      label={appointment.patientName.substring(0, 2).toUpperCase()}
                      style={[
                        styles.avatar,
                        { backgroundColor: appointment.patientGender === 'Male' ? '#2196F3' : '#E91E63' }
                      ]}
                    />
                    <View style={styles.patientInfo}>
                      <Text style={styles.patientName}>{appointment.patientName}</Text>
                      <Text style={styles.patientMeta}>
                        {appointment.patientAge}y • {appointment.patientGender}
                      </Text>
                    </View>
                  </View>

                  {/* Status & Type Chips */}
                  <View style={styles.chipsRow}>
                    <Chip
                      icon={getStatusIcon(appointment.status)}
                      style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) + '20' }]}
                      textStyle={[styles.statusText, { color: getStatusColor(appointment.status) }]}
                    >
                      {appointment.status}
                    </Chip>
                    
                    <Chip
                      icon="note-text"
                      style={[styles.typeChip, { backgroundColor: getTypeColor(appointment.type) + '10' }]}
                      textStyle={[styles.typeText, { color: getTypeColor(appointment.type) }]}
                    >
                      {appointment.type}
                    </Chip>
                  </View>

                  {/* Symptoms */}
                  {appointment.symptoms && (
                    <View style={styles.symptomsContainer}>
                      <MaterialCommunityIcons name="stethoscope" size={16} color="#666" />
                      <Text style={styles.symptomsText} numberOfLines={2}>
                        {appointment.symptoms}
                      </Text>
                    </View>
                  )}

                  {/* Diagnosis (if completed) */}
                  {appointment.diagnosis && (
                    <View style={styles.diagnosisContainer}>
                      <MaterialCommunityIcons name="clipboard-text" size={16} color="#4CAF50" />
                      <Text style={styles.diagnosisText} numberOfLines={2}>
                        Diagnosis: {appointment.diagnosis}
                      </Text>
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))
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
  filterContainer: {
    padding: 16,
    marginTop: -20,
  },
  segmentedButtons: {
    backgroundColor: '#fff',
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
  appointmentCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  cardContent: {
    padding: 16,
  },
  dateTimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
  },
  patientSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  statusChip: {
    height: 32,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  typeChip: {
    height: 32,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  symptomsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginBottom: 8,
  },
  symptomsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  diagnosisContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  diagnosisText: {
    flex: 1,
    fontSize: 14,
    color: '#4CAF50',
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default DoctorAppointmentsScreen;
