import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Card, Switch } from 'react-native-paper';
import { addMedicine } from '../api/services';

const AddMedicineScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    category: '',
    dosageForm: '',
    strength: '',
    price: '',
    description: '',
  });
  const [inStock, setInStock] = useState(true);
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.genericName || !formData.category) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await addMedicine({
        name: formData.name,
        genericName: formData.genericName,
        manufacturer: formData.manufacturer,
        category: formData.category,
        dosageForm: formData.dosageForm,
        strength: formData.strength,
        price: parseFloat(formData.price) || 0,
        inStock,
        description: formData.description,
        sideEffects: [],
        prescriptionRequired,
      });

      Alert.alert('Success', 'Medicine added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Add New Medicine</Title>

          <TextInput
            label="Medicine Name *"
            value={formData.name}
            onChangeText={text => setFormData({ ...formData, name: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Generic Name *"
            value={formData.genericName}
            onChangeText={text => setFormData({ ...formData, genericName: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Manufacturer"
            value={formData.manufacturer}
            onChangeText={text => setFormData({ ...formData, manufacturer: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Category *"
            value={formData.category}
            onChangeText={text => setFormData({ ...formData, category: text })}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Antibiotic, Analgesic"
          />

          <TextInput
            label="Dosage Form"
            value={formData.dosageForm}
            onChangeText={text => setFormData({ ...formData, dosageForm: text })}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Tablet, Capsule, Syrup"
          />

          <TextInput
            label="Strength"
            value={formData.strength}
            onChangeText={text => setFormData({ ...formData, strength: text })}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., 500mg, 100ml"
          />

          <TextInput
            label="Price (₹)"
            value={formData.price}
            onChangeText={text => setFormData({ ...formData, price: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={text => setFormData({ ...formData, description: text })}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          <View style={styles.switchContainer}>
            <Title style={styles.switchLabel}>In Stock</Title>
            <Switch value={inStock} onValueChange={setInStock} />
          </View>

          <View style={styles.switchContainer}>
            <Title style={styles.switchLabel}>Prescription Required</Title>
            <Switch value={prescriptionRequired} onValueChange={setPrescriptionRequired} />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="plus"
          >
            Add Medicine
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default AddMedicineScreen;
