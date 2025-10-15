import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Divider, Chip, ActivityIndicator } from 'react-native-paper';
import { getMedicineById } from '../api/services';
import { Medicine } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MedicineDetailScreen = ({ route }: any) => {
  const { medicineId } = route.params;
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicine();
  }, []);

  const fetchMedicine = async () => {
    try {
      const data = await getMedicineById(medicineId);
      setMedicine(data);
    } catch (error) {
      console.error('Error fetching medicine:', error);
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

  if (!medicine) {
    return (
      <View style={styles.centerContainer}>
        <Paragraph>Medicine not found</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.name}>{medicine.name}</Title>
          <Paragraph style={styles.generic}>{medicine.genericName}</Paragraph>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="factory" size={20} color="#666" />
              <Paragraph style={styles.label}>Manufacturer:</Paragraph>
            </View>
            <Paragraph>{medicine.manufacturer}</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="tag" size={20} color="#666" />
              <Paragraph style={styles.label}>Category:</Paragraph>
            </View>
            <Paragraph>{medicine.category}</Paragraph>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="pill" size={20} color="#666" />
              <Paragraph style={styles.label}>Dosage Form:</Paragraph>
            </View>
            <Paragraph>{medicine.dosageForm} - {medicine.strength}</Paragraph>
          </View>

          <View style={styles.chipContainer}>
            <Chip icon="currency-inr" style={styles.chip}>
              ₹{medicine.price}
            </Chip>
            <Chip
              icon={medicine.inStock ? 'check-circle' : 'close-circle'}
              style={[styles.chip, medicine.inStock ? styles.inStock : styles.outOfStock]}
            >
              {medicine.inStock ? 'In Stock' : 'Out of Stock'}
            </Chip>
            {medicine.prescriptionRequired && (
              <Chip icon="clipboard-text" style={styles.chip}>
                Prescription Required
              </Chip>
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Description</Title>
            <Paragraph>{medicine.description}</Paragraph>
          </View>

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Side Effects</Title>
            {medicine.sideEffects.map((effect, index) => (
              <View key={index} style={styles.listItem}>
                <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#666" />
                <Paragraph style={styles.listText}>{effect}</Paragraph>
              </View>
            ))}
          </View>
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
  generic: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
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
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  chip: {
    marginRight: 8,
    marginTop: 4,
  },
  inStock: {
    backgroundColor: '#c8e6c9',
  },
  outOfStock: {
    backgroundColor: '#ffcdd2',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  listText: {
    marginLeft: 8,
    flex: 1,
  },
});

export default MedicineDetailScreen;
