import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorDetailScreen from '../screens/DoctorDetailScreen';
import PatientListScreen from '../screens/PatientListScreen';
import PatientProfileScreen from '../screens/PatientProfileScreen';
import MedicineListScreen from '../screens/MedicineListScreen';
import MedicineDetailScreen from '../screens/MedicineDetailScreen';
import ArticleListScreen from '../screens/ArticleListScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import LabReportsScreen from '../screens/LabReportsScreen';
import UploadReportScreen from '../screens/UploadReportScreen';

// Admin Screens
import AdminScreen from '../screens/AdminScreen';
import AddDoctorScreen from '../screens/AddDoctorScreen';
import AddMedicineScreen from '../screens/AddMedicineScreen';
import AddArticleScreen from '../screens/AddArticleScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { user } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Doctors"
        component={DoctorListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="doctor" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Medicines"
        component={MedicineListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pill" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Articles"
        component={ArticleListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="newspaper" color={color} size={size} />
          ),
        }}
      />
      {user?.role === 'admin' && (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="shield-account" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
            <Stack.Screen name="PatientList" component={PatientListScreen} />
            <Stack.Screen name="PatientProfile" component={PatientProfileScreen} />
            <Stack.Screen name="MedicineDetail" component={MedicineDetailScreen} />
            <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
            <Stack.Screen name="LabReports" component={LabReportsScreen} />
            <Stack.Screen name="UploadReport" component={UploadReportScreen} />
            <Stack.Screen name="AddDoctor" component={AddDoctorScreen} />
            <Stack.Screen name="AddMedicine" component={AddMedicineScreen} />
            <Stack.Screen name="AddArticle" component={AddArticleScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
