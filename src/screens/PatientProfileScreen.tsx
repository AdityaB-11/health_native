import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Divider, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { View } from 'react-native';
import { getPatientById } from '../api/firebaseServices';
import { Patient } from '../types';

const PatientProfileScreen = ({ route, navigation }: any) => {
  const { patientId } = route.params;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  const loadPatient = async () => {
    try {
      const patientData = await getPatientById(patientId);
      setPatient(patientData);
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <Title>Patient not found</Title>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.name}>{patient.name}</Title>
          <Paragraph style={styles.info}>Age: {patient.age}</Paragraph>
          <Paragraph style={styles.info}>Gender: {patient.gender}</Paragraph>
          <Paragraph style={styles.info}>Blood Group: {patient.bloodGroup}</Paragraph>
          <Paragraph style={styles.info}>Phone: {patient.phone}</Paragraph>
          <Paragraph style={styles.info}>Email: {patient.email}</Paragraph>
          <Paragraph style={styles.info}>Address: {patient.address}</Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Medical History</Title>
            <Paragraph>Medical history information will be displayed here.</Paragraph>
          </View>

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Allergies</Title>
            <Paragraph>Allergy information will be displayed here.</Paragraph>
          </View>

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Current Medications</Title>
            <Paragraph>Current medications will be displayed here.</Paragraph>
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
  loadingContainer: {
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
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  infoChip: {
    margin: 4,
  },
  button: {
    marginTop: 16,
  },
});

export default PatientProfileScreen;
