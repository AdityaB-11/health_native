import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import { addDoctor } from '../api/services';

const AddDoctorScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    hospital: '',
    location: '',
    availability: '',
    consultationFee: '',
    phone: '',
    email: '',
    rating: '4.5',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.specialization || !formData.hospital) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await addDoctor({
        name: formData.name,
        specialization: formData.specialization,
        qualification: formData.qualification,
        experience: parseInt(formData.experience) || 0,
        hospital: formData.hospital,
        location: formData.location,
        availability: formData.availability,
        consultationFee: parseInt(formData.consultationFee) || 0,
        rating: parseFloat(formData.rating) || 4.5,
        imageUrl: 'https://via.placeholder.com/150',
        phone: formData.phone,
        email: formData.email,
      });

      Alert.alert('Success', 'Doctor added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Add New Doctor</Title>

          <TextInput
            label="Name *"
            value={formData.name}
            onChangeText={text => setFormData({ ...formData, name: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Specialization *"
            value={formData.specialization}
            onChangeText={text => setFormData({ ...formData, specialization: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Qualification"
            value={formData.qualification}
            onChangeText={text => setFormData({ ...formData, qualification: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Experience (years)"
            value={formData.experience}
            onChangeText={text => setFormData({ ...formData, experience: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Hospital *"
            value={formData.hospital}
            onChangeText={text => setFormData({ ...formData, hospital: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Location"
            value={formData.location}
            onChangeText={text => setFormData({ ...formData, location: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Availability"
            value={formData.availability}
            onChangeText={text => setFormData({ ...formData, availability: text })}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Mon-Fri, 9 AM - 5 PM"
          />

          <TextInput
            label="Consultation Fee (₹)"
            value={formData.consultationFee}
            onChangeText={text => setFormData({ ...formData, consultationFee: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Phone"
            value={formData.phone}
            onChangeText={text => setFormData({ ...formData, phone: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="plus"
          >
            Add Doctor
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
  input: {
    marginTop: 12,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default AddDoctorScreen;
