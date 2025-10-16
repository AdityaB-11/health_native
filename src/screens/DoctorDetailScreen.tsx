import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, Divider, Chip, ActivityIndicator } from 'react-native-paper';
import { getDoctorById } from '../api/services';
import { Doctor } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DoctorDetailScreen = ({ route, navigation }: any) => {
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const data = await getDoctorById(doctorId);
      setDoctor(data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
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

  if (!doctor) {
    return (
      <View style={styles.centerContainer}>
        <Paragraph>Doctor not found</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.name}>{doctor.name}</Title>
          <Paragraph style={styles.specialization}>{doctor.specialization}</Paragraph>
          
          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="school" size={20} color="#666" />
              <Paragraph style={styles.label}>Qualification:</Paragraph>
            </View>
            <Paragraph>{doctor.qualification}</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="briefcase" size={20} color="#666" />
              <Paragraph style={styles.label}>Experience:</Paragraph>
            </View>
            <Paragraph>{doctor.experience} years</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="hospital-building" size={20} color="#666" />
              <Paragraph style={styles.label}>Hospital:</Paragraph>
            </View>
            <Paragraph>{doctor.hospital}</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
              <Paragraph style={styles.label}>Location:</Paragraph>
            </View>
            <Paragraph>{doctor.location}</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
              <Paragraph style={styles.label}>Availability:</Paragraph>
            </View>
            <Paragraph>{doctor.availability}</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="phone" size={20} color="#666" />
              <Paragraph style={styles.label}>Phone:</Paragraph>
            </View>
            <Paragraph>{doctor.phone}</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="email" size={20} color="#666" />
              <Paragraph style={styles.label}>Email:</Paragraph>
            </View>
            <Paragraph>{doctor.email}</Paragraph>
          </View>

          <View style={styles.chipContainer}>
            <Chip icon="star" style={styles.chip}>
              Rating: ⭐ {doctor.rating}
            </Chip>
            <Chip icon="currency-inr" style={styles.chip}>
              Fee: ₹{doctor.consultationFee}
            </Chip>
          </View>

          <Button
            mode="contained"
            style={styles.button}
            icon="calendar-plus"
            onPress={() => navigation.navigate('BookAppointment', { 
              doctorId: doctor.id,
              doctorName: doctor.name,
              doctorSpecialization: doctor.specialization,
              consultationFee: doctor.consultationFee 
            })}
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
  },
  specialization: {
    fontSize: 18,
    color: '#6200ee',
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
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
  chipContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  button: {
    marginTop: 8,
  },
});

export default DoctorDetailScreen;
