import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Avatar, Divider, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { getPatientById } from '../api/services';
import { Patient } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PatientProfileScreen = ({ route, navigation }: any) => {
  const { patientId } = route.params;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    try {
      const data = await getPatientById(patientId);
      setPatient(data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.centerContainer}>
        <Paragraph>Patient not found</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.name}>{patient.name}</Title>
          
          <View style={styles.chipContainer}>
            <Chip icon="calendar" style={styles.chip}>
              {patient.age} years
            </Chip>
            <Chip icon="gender-male-female" style={styles.chip}>
              {patient.gender}
            </Chip>
            <Chip icon="water" style={styles.chip}>
              {patient.bloodGroup}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="phone" size={20} color="#666" />
              <Paragraph style={styles.label}>Phone:</Paragraph>
            </View>
            <Paragraph>{patient.phone}</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="email" size={20} color="#666" />
              <Paragraph style={styles.label}>Email:</Paragraph>
            </View>
            <Paragraph>{patient.email}</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="home" size={20} color="#666" />
              <Paragraph style={styles.label}>Address:</Paragraph>
            </View>
            <Paragraph>{patient.address}</Paragraph>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Medical History</Title>
            {patient.medicalHistory.length > 0 ? (
              patient.medicalHistory.map((item, index) => (
                <Chip key={index} style={styles.infoChip} icon="clipboard-text">
                  {item}
                </Chip>
              ))
            ) : (
              <Paragraph>No medical history recorded</Paragraph>
            )}
          </View>

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Allergies</Title>
            {patient.allergies.length > 0 ? (
              patient.allergies.map((item, index) => (
                <Chip key={index} style={styles.infoChip} icon="alert-circle">
                  {item}
                </Chip>
              ))
            ) : (
              <Paragraph>No known allergies</Paragraph>
            )}
          </View>

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Current Medications</Title>
            {patient.currentMedications.length > 0 ? (
              patient.currentMedications.map((item, index) => (
                <Chip key={index} style={styles.infoChip} icon="pill">
                  {item}
                </Chip>
              ))
            ) : (
              <Paragraph>No current medications</Paragraph>
            )}
          </View>

          <Button 
            mode="contained" 
            style={styles.button}
            icon="file-document"
            onPress={() => navigation.navigate('LabReports', { patientId: patient.id })}
          >
            View Lab Reports
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  chip: {
    marginRight: 8,
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  infoChip: {
    marginRight: 8,
    marginTop: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default PatientProfileScreen;
