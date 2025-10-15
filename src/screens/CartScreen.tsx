import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  IconButton, 
  Text,
  Divider,
  TextInput,
  Chip
} from 'react-native-paper';
import { useCart } from '../context/CartContext';

interface CartScreenProps {
  navigation: any;
}

interface Order {
  id: string;
  items: Array<{
    medicine: any;
    quantity: number;
  }>;
  total: number;
  deliveryAddress: string;
  contactNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (medicineId: string, change: number) => {
    const currentItem = state.items.find(item => item.medicine.id === medicineId);
    if (currentItem) {
      const newQuantity = currentItem.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(medicineId, newQuantity);
      } else {
        removeFromCart(medicineId);
      }
    }
  };

  const calculateDeliveryCharge = () => {
    if (state.total > 500) return 0; // Free delivery for orders above ₹500
    return 50; // ₹50 delivery charge
  };

  const calculateGrandTotal = () => {
    return state.total + calculateDeliveryCharge();
  };

  const generateEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 2); // 2 days from now
    return deliveryDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handlePlaceOrder = async () => {
    if (state.items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    if (!deliveryAddress || !contactNumber) {
      Alert.alert('Error', 'Please fill in delivery address and contact number');
      return;
    }

    if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit contact number');
      return;
    }

    setLoading(true);

    // Mock order processing
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const order: Order = {
        id: `ORD${Date.now()}`,
        items: state.items,
        total: calculateGrandTotal(),
        deliveryAddress,
        contactNumber,
        orderDate: new Date().toISOString(),
        estimatedDelivery: generateEstimatedDelivery(),
        status: 'confirmed'
      };

      // Clear cart after successful order
      clearCart();

      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Order ID: ${order.id}\n\nTotal: ₹${order.total}\nEstimated Delivery: ${order.estimatedDelivery}\n\nYou will receive SMS updates on +91-${contactNumber}`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Medicine') 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <IconButton icon="cart-outline" size={80} iconColor="#ccc" />
            <Title style={styles.emptyTitle}>Your cart is empty</Title>
            <Paragraph style={styles.emptyText}>
              Add medicines to your cart to see them here
            </Paragraph>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Medicine')}
              style={styles.shopButton}
              icon="plus"
            >
              Start Shopping
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cart Items */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Cart Items ({state.itemCount})</Title>
          
          {state.items.map((item) => (
            <View key={item.medicine.id}>
              <View style={styles.itemContainer}>
                <View style={styles.itemInfo}>
                  <Text style={styles.medicineName}>{item.medicine.name}</Text>
                  <Text style={styles.medicineGeneric}>{item.medicine.genericName}</Text>
                  <Text style={styles.medicineStrength}>{item.medicine.strength}</Text>
                  <View style={styles.medicineDetails}>
                    <Chip style={styles.categoryChip}>
                      {item.medicine.category}
                    </Chip>
                    {item.medicine.prescriptionRequired && (
                      <Chip style={styles.prescriptionChip}>
                        Prescription Required
                      </Chip>
                    )}
                  </View>
                </View>
                
                <View style={styles.itemActions}>
                  <Text style={styles.price}>₹{item.medicine.price}</Text>
                  <View style={styles.quantityContainer}>
                    <IconButton
                      icon="minus"
                      size={20}
                      onPress={() => handleQuantityChange(item.medicine.id, -1)}
                      style={styles.quantityButton}
                    />
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      onPress={() => handleQuantityChange(item.medicine.id, 1)}
                      style={styles.quantityButton}
                    />
                  </View>
                  <Text style={styles.itemTotal}>₹{item.medicine.price * item.quantity}</Text>
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => removeFromCart(item.medicine.id)}
                    iconColor="#f44336"
                  />
                </View>
              </View>
              <Divider style={styles.itemDivider} />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Delivery Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Delivery Information</Title>
          
          <TextInput
            label="Delivery Address *"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Enter complete delivery address"
          />

          <TextInput
            label="Contact Number *"
            value={contactNumber}
            onChangeText={setContactNumber}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="10-digit mobile number"
            maxLength={10}
          />
        </Card.Content>
      </Card>

      {/* Order Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Order Summary</Title>
          
          <View style={styles.summaryRow}>
            <Text>Subtotal ({state.itemCount} items)</Text>
            <Text>₹{state.total}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text>Delivery Charges</Text>
            <Text style={calculateDeliveryCharge() === 0 ? styles.freeDelivery : undefined}>
              {calculateDeliveryCharge() === 0 ? 'FREE' : `₹${calculateDeliveryCharge()}`}
            </Text>
          </View>
          
          {calculateDeliveryCharge() === 0 && (
            <Text style={styles.freeDeliveryNote}>
              🎉 Free delivery on orders above ₹500
            </Text>
          )}
          
          <Divider style={styles.summaryDivider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{calculateGrandTotal()}</Text>
          </View>

          <Text style={styles.deliveryNote}>
            📦 Estimated delivery: {generateEstimatedDelivery()}
          </Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          mode="outlined"
          onPress={clearCart}
          style={styles.clearButton}
          icon="delete-sweep"
          disabled={loading}
        >
          Clear Cart
        </Button>
        
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          style={styles.orderButton}
          loading={loading}
          disabled={loading}
          icon="check"
        >
          Place Order
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  emptyCard: {
    elevation: 4,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#999',
  },
  shopButton: {
    marginTop: 20,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 4,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#2196F3',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  medicineGeneric: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  medicineStrength: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  medicineDetails: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  prescriptionChip: {
    backgroundColor: '#fff3e0',
    marginBottom: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  quantityButton: {
    margin: 0,
    backgroundColor: '#f0f0f0',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  itemDivider: {
    marginVertical: 8,
  },
  input: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  freeDelivery: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  freeDeliveryNote: {
    fontSize: 12,
    color: '#4CAF50',
    fontStyle: 'italic',
    marginTop: 4,
  },
  summaryDivider: {
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  deliveryNote: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
  },
  clearButton: {
    flex: 1,
    marginRight: 8,
  },
  orderButton: {
    flex: 2,
    marginLeft: 8,
  },
});

export default CartScreen;