import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  TextInput, 
  Button, 
  Title, 
  Paragraph, 
  Card, 
  RadioButton, 
  Chip,
  List,
  Divider 
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDoctors } from '../api/services';
import { addAppointment } from '../api/firebaseServices';
import { Doctor, Appointment } from '../types';
import { formatDate } from '../utils/dateUtils';

interface BookAppointmentProps {
  route: any;
  navigation: any;
}

const BookAppointmentScreen: React.FC<BookAppointmentProps> = ({ route, navigation }) => {
  const { doctorId: preSelectedDoctorId, patientId } = route.params || {};
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [appointmentType, setAppointmentType] = useState<'consultation' | 'follow-up' | 'emergency'>('consultation');
  const [symptoms, setSymptoms] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const doctorList = await getDoctors();
      setDoctors(doctorList);
      
      // If a doctor was pre-selected, set it
      if (preSelectedDoctorId) {
        const preSelected = doctorList.find(d => d.id === preSelectedDoctorId);
        if (preSelected) {
          setSelectedDoctor(preSelected);
        }
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      Alert.alert('Error', 'Failed to load doctors');
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !patientName || !patientAge || !symptoms) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (parseInt(patientAge) < 1 || parseInt(patientAge) > 120) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }

    setLoading(true);
    try {
      const appointmentData: Omit<Appointment, 'id'> = {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        patientId: patientId || 'walk-in',
        patientName,
        patientAge: parseInt(patientAge),
        patientGender,
        appointmentDate: appointmentDate.toISOString().split('T')[0],
        appointmentTime: appointmentTime.toTimeString().split(' ')[0].substring(0, 5),
        status: 'scheduled',
        type: appointmentType,
        symptoms,
        createdAt: new Date().toISOString(),
      };

      await addAppointment(appointmentData);

      Alert.alert(
        'Success', 
        `Appointment booked successfully!\n\nDoctor: ${selectedDoctor.name}\nDate: ${formatDate(appointmentDate)}\nTime: ${appointmentTime.toTimeString().split(' ')[0].substring(0, 5)}`,
        [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]
      );
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAppointmentDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setAppointmentTime(selectedTime);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Book Appointment</Title>

          {/* Doctor Selection */}
          <View style={styles.section}>
            <Paragraph style={styles.label}>Select Doctor *</Paragraph>
            {selectedDoctor ? (
              <Card style={styles.selectedDoctorCard}>
                <Card.Content>
                  <Title style={styles.doctorName}>{selectedDoctor.name}</Title>
                  <Paragraph>{selectedDoctor.specialization}</Paragraph>
                  <Paragraph>{selectedDoctor.hospital}</Paragraph>
                  <Paragraph>₹{selectedDoctor.consultationFee} consultation fee</Paragraph>
                  {!preSelectedDoctorId && (
                    <Button 
                      mode="outlined" 
                      onPress={() => setSelectedDoctor(null)}
                      style={styles.changeButton}
                    >
                      Change Doctor
                    </Button>
                  )}
                </Card.Content>
              </Card>
            ) : (
              <View>
                {doctors.map((doctor) => (
                  <Card 
                    key={doctor.id} 
                    style={styles.doctorCard}
                    onPress={() => setSelectedDoctor(doctor)}
                  >
                    <Card.Content>
                      <View style={styles.doctorInfo}>
                        <View style={styles.doctorDetails}>
                          <Title style={styles.doctorName}>{doctor.name}</Title>
                          <Paragraph>{doctor.specialization}</Paragraph>
                          <Paragraph>{doctor.hospital}</Paragraph>
                          <Chip style={styles.feeChip}>₹{doctor.consultationFee}</Chip>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Patient Information */}
          <View style={styles.section}>
            <Paragraph style={styles.label}>Patient Information</Paragraph>
            
            <TextInput
              label="Patient Name *"
              value={patientName}
              onChangeText={setPatientName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Age *"
              value={patientAge}
              onChangeText={setPatientAge}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter age"
            />

            <Paragraph style={styles.label}>Gender *</Paragraph>
            <RadioButton.Group 
              onValueChange={value => setPatientGender(value as 'Male' | 'Female' | 'Other')} 
              value={patientGender}
            >
              <View style={styles.radioContainer}>
                <RadioButton.Item label="Male" value="Male" />
                <RadioButton.Item label="Female" value="Female" />
                <RadioButton.Item label="Other" value="Other" />
              </View>
            </RadioButton.Group>
          </View>

          <Divider style={styles.divider} />

          {/* Appointment Details */}
          <View style={styles.section}>
            <Paragraph style={styles.label}>Appointment Details</Paragraph>

            <Paragraph style={styles.label}>Type of Appointment *</Paragraph>
            <RadioButton.Group 
              onValueChange={value => setAppointmentType(value as 'consultation' | 'follow-up' | 'emergency')} 
              value={appointmentType}
            >
              <View style={styles.radioContainer}>
                <RadioButton.Item label="General Consultation" value="consultation" />
                <RadioButton.Item label="Follow-up" value="follow-up" />
                <RadioButton.Item label="Emergency" value="emergency" />
              </View>
            </RadioButton.Group>

            <View style={styles.dateTimeContainer}>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateTimeButton}
                icon="calendar"
              >
                Date: {formatDate(appointmentDate)}
              </Button>

              <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                style={styles.dateTimeButton}
                icon="clock"
              >
                Time: {appointmentTime.toTimeString().split(' ')[0].substring(0, 5)}
              </Button>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={appointmentDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={getMinDate()}
                maximumDate={getMaxDate()}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={appointmentTime}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}

            <TextInput
              label="Symptoms / Reason for Visit *"
              value={symptoms}
              onChangeText={setSymptoms}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Describe your symptoms or reason for the appointment"
            />
          </View>

          <Button
            mode="contained"
            onPress={handleBookAppointment}
            loading={loading}
            disabled={loading || !selectedDoctor}
            style={styles.bookButton}
            icon="calendar-check"
          >
            Book Appointment
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2196F3',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    marginTop: 8,
  },
  radioContainer: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  selectedDoctorCard: {
    backgroundColor: '#e3f2fd',
    marginTop: 8,
  },
  doctorCard: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    marginBottom: 4,
  },
  feeChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  changeButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateTimeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  bookButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default BookAppointmentScreen;