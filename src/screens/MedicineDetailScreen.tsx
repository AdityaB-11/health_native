import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Divider, Chip, ActivityIndicator, Button, IconButton, Surface } from 'react-native-paper';
import { getMedicineById } from '../api/services';
import { Medicine } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const MedicineDetailScreen = ({ route, navigation }: any) => {
  const { medicineId } = route.params;
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, updateQuantity, getItemQuantity, removeFromCart } = useCart();

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

  const handleAddToCart = () => {
    if (medicine) {
      addToCart(medicine, 1);
      Alert.alert(
        'Added to Cart', 
        `${medicine.name} has been added to your cart`,
        [
          { text: 'Continue Shopping', style: 'default' },
          { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
        ]
      );
    }
  };

  const handleUpdateQuantity = (change: number) => {
    if (!medicine) return;
    
    const currentQuantity = getItemQuantity(medicine.id);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity <= 0) {
      removeFromCart(medicine.id);
    } else {
      updateQuantity(medicine.id, newQuantity);
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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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

      {/* Cart Actions */}
      <Surface style={styles.cartActionsContainer} elevation={5}>
        <View style={styles.cartActions}>
          <View style={styles.priceSection}>
            <Title style={styles.price}>₹{medicine.price}</Title>
            <Paragraph style={styles.priceLabel}>per unit</Paragraph>
          </View>
          
          {!medicine.inStock ? (
            <Button 
              mode="contained" 
              disabled 
              style={styles.outOfStockButton}
              icon="close-circle"
            >
              Out of Stock
            </Button>
          ) : (
            <View style={styles.cartButtonsContainer}>
              {getItemQuantity(medicine.id) > 0 ? (
                <View style={styles.quantityControls}>
                  <IconButton
                    icon="minus"
                    mode="contained"
                    size={20}
                    onPress={() => handleUpdateQuantity(-1)}
                    style={styles.quantityButton}
                  />
                  <Title style={styles.quantityText}>
                    {getItemQuantity(medicine.id)}
                  </Title>
                  <IconButton
                    icon="plus"
                    mode="contained"
                    size={20}
                    onPress={() => handleUpdateQuantity(1)}
                    style={styles.quantityButton}
                  />
                </View>
              ) : (
                <Button
                  mode="contained"
                  icon="cart-plus"
                  onPress={handleAddToCart}
                  style={styles.addToCartButton}
                  buttonColor="#FF9800"
                >
                  Add to Cart
                </Button>
              )}
              
              <Button
                mode="outlined"
                icon="cart-arrow-right"
                onPress={() => navigation.navigate('Cart')}
                style={styles.viewCartButton}
              >
                View Cart
              </Button>
            </View>
          )}
        </View>
      </Surface>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for floating cart actions
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
  cartActionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cartActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  priceSection: {
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  cartButtonsContainer: {
    flex: 2,
    marginLeft: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    backgroundColor: '#FF9800',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addToCartButton: {
    marginBottom: 8,
  },
  viewCartButton: {
    borderColor: '#FF9800',
  },
  outOfStockButton: {
    backgroundColor: '#ccc',
  },
});

export default MedicineDetailScreen;
