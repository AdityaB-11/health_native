import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Chip, ActivityIndicator, Surface } from 'react-native-paper';
import { getDoctors } from '../api/services';
import { Doctor } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const DoctorListScreen = ({ navigation }: any) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(query.toLowerCase()) ||
          doctor.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
      activeOpacity={0.7}
    >
      <Surface style={styles.doctorCard} elevation={2}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.avatar}
            >
              <MaterialCommunityIcons name="doctor" size={32} color="#fff" />
            </LinearGradient>
          </View>
          <View style={styles.doctorInfo}>
            <Title style={styles.doctorName}>{item.name}</Title>
            <Chip icon="stethoscope" style={styles.specializationChip} textStyle={styles.chipText}>
              {item.specialization}
            </Chip>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="hospital-building" size={18} color="#666" />
            <Paragraph style={styles.detailText}>{item.hospital}</Paragraph>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#666" />
            <Paragraph style={styles.detailText}>{item.location}</Paragraph>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="star" size={18} color="#FFB300" />
            <Paragraph style={styles.detailText}>{item.rating} • {item.experience} years experience</Paragraph>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="currency-inr" size={18} color="#4CAF50" />
            <Paragraph style={styles.detailText}>₹{item.consultationFee} consultation</Paragraph>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.availabilityBadge}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#4CAF50" />
            <Paragraph style={styles.availabilityText}>Available</Paragraph>
          </View>
          <Paragraph style={styles.tapText}>Tap to view details</Paragraph>
        </View>
      </Surface>
    </TouchableOpacity>
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
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      <LinearGradient
        colors={['#6200ee', '#7c4dff']}
        style={styles.header}
      >
        <Title style={styles.headerTitle}>Our Doctors</Title>
        <Paragraph style={styles.headerSubtitle}>
          {filteredDoctors.length} specialists available
        </Paragraph>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name, specialization, or location"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#6200ee"
          inputStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 16,
  },
  searchbar: {
    elevation: 4,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    fontSize: 14,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  specializationChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    height: 28,
  },
  chipText: {
    fontSize: 12,
    color: '#1976D2',
  },
  detailsContainer: {
    gap: 12,
    marginBottom: 16,
    paddingLeft: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availabilityText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  tapText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default DoctorListScreen;
