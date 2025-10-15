import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Medicine } from '../types';

export interface CartItem {
  id: string;
  medicine: Medicine;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export type CartAction =
  | { type: 'ADD_TO_CART'; medicine: Medicine; quantity?: number }
  | { type: 'REMOVE_FROM_CART'; medicineId: string }
  | { type: 'UPDATE_QUANTITY'; medicineId: string; quantity: number }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.medicine.id === action.medicine.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.quantity || 1) }
            : item
        );
      } else {
        // New item, add to cart
        newItems = [
          ...state.items,
          {
            id: action.medicine.id,
            medicine: action.medicine,
            quantity: action.quantity || 1,
          },
        ];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.medicine.id !== action.medicineId);
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter(item => item.medicine.id !== action.medicineId);
        return {
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        };
      }

      const newItems = state.items.map(item =>
        item.medicine.id === action.medicineId
          ? { ...item, quantity: action.quantity }
          : item
      );

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (medicine: Medicine, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (medicineId: string) => boolean;
  getItemQuantity: (medicineId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (medicine: Medicine, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', medicine, quantity });
  };

  const removeFromCart = (medicineId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', medicineId });
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', medicineId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (medicineId: string): boolean => {
    return state.items.some(item => item.medicine.id === medicineId);
  };

  const getItemQuantity = (medicineId: string): number => {
    const item = state.items.find(item => item.medicine.id === medicineId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};