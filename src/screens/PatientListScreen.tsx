import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Chip, ActivityIndicator } from 'react-native-paper';
import { getPatients } from '../api/services';
import { Patient } from '../types';

const PatientListScreen = ({ navigation }: any) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query.toLowerCase()) ||
          patient.email.toLowerCase().includes(query.toLowerCase()) ||
          patient.bloodGroup.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const renderPatient = ({ item }: { item: Patient }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('PatientProfile', { patientId: item.id })}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <View style={styles.detailsRow}>
          <Chip icon="calendar" style={styles.chip}>
            {item.age} years
          </Chip>
          <Chip icon="gender-male-female" style={styles.chip}>
            {item.gender}
          </Chip>
          <Chip icon="water" style={styles.chip}>
            {item.bloodGroup}
          </Chip>
        </View>
        <Paragraph style={styles.contact}>📞 {item.phone}</Paragraph>
        <Paragraph style={styles.contact}>📧 {item.email}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search patients by name, email, or blood group"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={filteredPatients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
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
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginTop: 4,
  },
  contact: {
    marginTop: 4,
    color: '#666',
  },
});

export default PatientListScreen;
