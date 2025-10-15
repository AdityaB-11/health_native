import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Chip, ActivityIndicator, Badge, FAB, Surface, Button, IconButton } from 'react-native-paper';
import { getMedicines } from '../api/services';
import { Medicine } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MedicineListScreen = ({ navigation }: any) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(query.toLowerCase()) ||
          medicine.genericName.toLowerCase().includes(query.toLowerCase()) ||
          medicine.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  };

  const addToCart = (medicineId: string) => {
    setCart(prev => ({
      ...prev,
      [medicineId]: (prev[medicineId] || 0) + 1
    }));
  };

  const removeFromCart = (medicineId: string) => {
    setCart(prev => {
      const newCart = {...prev};
      if (newCart[medicineId] > 1) {
        newCart[medicineId]--;
      } else {
        delete newCart[medicineId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const medicine = medicines.find(m => m.id === id);
      return sum + (medicine?.price || 0) * qty;
    }, 0);
  };

  const renderMedicine = ({ item }: { item: Medicine }) => {
    const quantity = cart[item.id] || 0;
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('MedicineDetail', { medicineId: item.id })}
        activeOpacity={0.9}
      >
        <Surface style={styles.productCard} elevation={2}>
          <View style={styles.productImageContainer}>
            <LinearGradient
              colors={['#FF9800', '#F57C00'] as const}
              style={styles.productImage}
            >
              <MaterialCommunityIcons name="pill" size={36} color="#fff" />
            </LinearGradient>
            {item.prescriptionRequired && (
              <View style={styles.rxBadge}>
                <MaterialCommunityIcons name="clipboard-text" size={14} color="#fff" />
                <Paragraph style={styles.rxText}>Rx</Paragraph>
              </View>
            )}
          </View>
          
          <View style={styles.productInfo}>
            <View style={styles.productHeader}>
              <View style={styles.productTitleRow}>
                <View style={styles.productTitleContainer}>
                  <Title style={styles.productName} numberOfLines={1}>{item.name}</Title>
                  <Paragraph style={styles.genericName} numberOfLines={1}>{item.genericName}</Paragraph>
                  <Paragraph style={styles.manufacturer} numberOfLines={1}>{item.manufacturer}</Paragraph>
                </View>
                <View style={styles.productMeta}>
                  <Chip icon="package-variant" style={styles.metaChip} textStyle={styles.metaChipText}>
                    {item.dosageForm}
                  </Chip>
                  <Chip icon="weight" style={styles.metaChip} textStyle={styles.metaChipText}>
                    {item.strength}
                  </Chip>
                </View>
              </View>
            </View>

            <View style={styles.productFooter}>
              <View style={styles.priceContainer}>
                <Title style={styles.price}>₹{item.price.toFixed(2)}</Title>
                <Paragraph style={styles.perUnit}>per unit</Paragraph>
              </View>
              
              <View style={styles.actionContainer}>
                {!item.inStock ? (
                  <Chip icon="close-circle" style={styles.outOfStockChip} textStyle={styles.outOfStockText}>
                    Out of Stock
                  </Chip>
                ) : quantity > 0 ? (
                  <View style={styles.cartControls}>
                    <IconButton
                      icon="minus"
                      size={16}
                      iconColor="#fff"
                      style={styles.cartButton}
                      onPress={() => removeFromCart(item.id)}
                    />
                    <Paragraph style={styles.cartQuantity}>{quantity}</Paragraph>
                    <IconButton
                      icon="plus"
                      size={16}
                      iconColor="#fff"
                      style={styles.cartButton}
                      onPress={() => addToCart(item.id)}
                    />
                  </View>
                ) : (
                  <Button
                    mode="contained"
                    icon="cart-plus"
                    onPress={() => addToCart(item.id)}
                    style={styles.addToCartButton}
                    labelStyle={styles.addToCartLabel}
                    buttonColor="#FF9800"
                  >
                    Add
                  </Button>
                )}
              </View>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  const totalItems = getTotalItems();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF9800" />
      <LinearGradient
        colors={['#FF9800', '#F57C00']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Title style={styles.headerTitle}>Medicine Store</Title>
            <Paragraph style={styles.headerSubtitle}>
              {filteredMedicines.length} products available
            </Paragraph>
          </View>
          <TouchableOpacity style={styles.cartIcon}>
            <MaterialCommunityIcons name="cart" size={28} color="#fff" />
            {totalItems > 0 && (
              <Badge style={styles.cartBadge}>{totalItems}</Badge>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search medicines..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#FF9800"
          inputStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredMedicines}
        renderItem={renderMedicine}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View style={styles.listHeader} />}
      />

      {totalItems > 0 && (
        <Surface style={styles.cartSummary} elevation={5}>
          <View style={styles.cartSummaryContent}>
            <View>
              <Paragraph style={styles.cartSummaryLabel}>Total ({totalItems} items)</Paragraph>
              <Title style={styles.cartSummaryPrice}>₹{getTotalPrice().toFixed(2)}</Title>
            </View>
            <Button
              mode="contained"
              icon="cart-arrow-right"
              style={styles.checkoutButton}
              labelStyle={styles.checkoutLabel}
              buttonColor="#4CAF50"
            >
              Checkout
            </Button>
          </View>
        </Surface>
      )}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  cartIcon: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F44336',
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
  listHeader: {
    height: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Extra padding for floating cart
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    height: 135,
  },
  productImageContainer: {
    width: 90,
    height: 135,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rxBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#F44336',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  rxText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
    margin: 0,
  },
  productInfo: {
    flex: 1,
    padding: 8,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  productHeader: {
    marginBottom: 0,
    flex: 0,
  },
  productTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productTitleContainer: {
    flex: 1,
    marginRight: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
    lineHeight: 16,
  },
  genericName: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 1,
    lineHeight: 12,
  },
  manufacturer: {
    fontSize: 9,
    color: '#999',
    marginBottom: 0,
    lineHeight: 11,
  },
  productMeta: {
    flexDirection: 'column',
    gap: 3,
    alignItems: 'flex-end',
    flexShrink: 0,
    minWidth: 65,
  },
  metaChip: {
    height: 20,
    backgroundColor: '#F5F5F5',
    maxWidth: 70,
  },
  metaChipText: {
    fontSize: 8,
    color: '#666',
    lineHeight: 10,
    flexWrap: 'wrap',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 0,
    lineHeight: 18,
  },
  perUnit: {
    fontSize: 8,
    color: '#999',
    marginTop: -1,
    lineHeight: 10,
  },
  actionContainer: {
    flexShrink: 0,
    marginLeft: 8,
  },
  outOfStockChip: {
    height: 26,
    backgroundColor: '#ffebee',
  },
  outOfStockText: {
    color: '#c62828',
    fontSize: 9,
    fontWeight: '600',
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 14,
    paddingHorizontal: 2,
    height: 28,
  },
  cartButton: {
    backgroundColor: 'transparent',
    margin: 0,
  },
  cartQuantity: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
    margin: 0,
  },
  addToCartButton: {
    borderRadius: 14,
    height: 28,
  },
  addToCartLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginVertical: 0,
  },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cartSummaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  cartSummaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cartSummaryPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  checkoutButton: {
    borderRadius: 24,
    paddingHorizontal: 8,
  },
  checkoutLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  generic: {
    fontStyle: 'italic',
    color: '#666',
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  inStock: {
    backgroundColor: '#c8e6c9',
  },
  outOfStock: {
    backgroundColor: '#ffcdd2',
  },
});

export default MedicineListScreen;
