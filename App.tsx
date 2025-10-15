import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
