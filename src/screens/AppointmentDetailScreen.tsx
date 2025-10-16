import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Surface, 
  IconButton, 
  Chip, 
  Avatar, 
  ActivityIndicator,
  Button,
  Divider
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getAppointmentById, updateAppointment } from '../api/firebaseServices';
import { Appointment } from '../types';

interface AppointmentDetailScreenProps {
  route: {
    params: {
      appointmentId: string;
    };
  };
  navigation: any;
}

const AppointmentDetailScreen: React.FC<AppointmentDetailScreenProps> = ({ route, navigation }) => {
  const { appointmentId } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const appointmentData = await getAppointmentById(appointmentId);
      setAppointment(appointmentData);
    } catch (error) {
      console.error('Error loading appointment:', error);
      Alert.alert('Error', 'Failed to load appointment details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: 'scheduled' | 'completed' | 'cancelled' | 'in-progress') => {
    if (!appointment) return;

    try {
      setUpdating(true);
      await updateAppointment(appointmentId, { status: newStatus });
      setAppointment({ ...appointment, status: newStatus });
      Alert.alert('Success', `Appointment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update appointment status');
    } finally {
      setUpdating(false);
    }
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

  if (!appointment) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorText}>Appointment not found</Text>
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
        colors={[getStatusColor(appointment.status), getStatusColor(appointment.status) + 'CC']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            iconColor="#fff"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Patient Info */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.patientHeader}>
              <Avatar.Icon size={64} icon="account" style={styles.patientAvatar} />
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{appointment.patientName}</Text>
                <Text style={styles.patientMeta}>
                  {appointment.patientAge} years • {appointment.patientGender}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Appointment Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Appointment Information</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{appointment.appointmentDate}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{appointment.appointmentTime}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="note-text" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>{appointment.type}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name={getStatusIcon(appointment.status)} size={20} color={getStatusColor(appointment.status)} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Status</Text>
                <Chip
                  icon={getStatusIcon(appointment.status)}
                  style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) + '20' }]}
                  textStyle={[styles.statusText, { color: getStatusColor(appointment.status) }]}
                >
                  {appointment.status}
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Symptoms */}
        {appointment.symptoms && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Symptoms</Text>
              <Divider style={styles.divider} />
              <Surface style={styles.symptomsContainer}>
                <MaterialCommunityIcons name="stethoscope" size={20} color="#FF9800" />
                <Text style={styles.symptomsText}>{appointment.symptoms}</Text>
              </Surface>
            </Card.Content>
          </Card>
        )}

        {/* Notes */}
        {appointment.notes && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Doctor Notes</Text>
              <Divider style={styles.divider} />
              <Surface style={styles.notesContainer}>
                <MaterialCommunityIcons name="note-edit" size={20} color="#2196F3" />
                <Text style={styles.notesText}>{appointment.notes}</Text>
              </Surface>
            </Card.Content>
          </Card>
        )}

        {/* Status Actions */}
        {user?.role === 'doctor' && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Update Status</Text>
              <Divider style={styles.divider} />
              
              <View style={styles.actionButtons}>
                {appointment.status === 'scheduled' && (
                  <Button
                    mode="contained"
                    onPress={() => updateStatus('in-progress')}
                    loading={updating}
                    disabled={updating}
                    style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                    icon="play"
                  >
                    Start Consultation
                  </Button>
                )}
                
                {appointment.status === 'in-progress' && (
                  <Button
                    mode="contained"
                    onPress={() => updateStatus('completed')}
                    loading={updating}
                    disabled={updating}
                    style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                    icon="check"
                  >
                    Mark Complete
                  </Button>
                )}
                
                <Button
                  mode="outlined"
                  onPress={() => updateStatus('cancelled')}
                  loading={updating}
                  disabled={updating}
                  style={styles.actionButton}
                  textColor="#F44336"
                  icon="close"
                >
                  Cancel
                </Button>
              </View>
            </Card.Content>
          </Card>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  patientAvatar: {
    backgroundColor: '#E3F2FD',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  patientMeta: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  patientContact: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 2,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  symptomsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFF3E0',
  },
  symptomsText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  notesText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginVertical: 4,
  },
});

export default AppointmentDetailScreen;