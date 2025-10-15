import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { loginUser as firebaseLogin, getCurrentUserData, subscribeToAuthChanges, logoutUser as firebaseLogout } from '../api/firebaseAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch their data from Firestore
        try {
          const userData = await getCurrentUserData(firebaseUser.uid);
          if (userData) {
            const user: User = {
              id: firebaseUser.uid,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              doctorId: userData.doctorId,
              patientId: userData.patientId,
            };
            setUser(user);
            await AsyncStorage.setItem('user', JSON.stringify(user));
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      } else {
        // User is signed out
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const firebaseUser = await firebaseLogin(email, password);
      const userData = await getCurrentUserData(firebaseUser.uid);
      
      if (userData) {
        const user: User = {
          id: firebaseUser.uid,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          doctorId: userData.doctorId,
          patientId: userData.patientId,
        };
        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
