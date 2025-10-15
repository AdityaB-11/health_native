import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, Surface } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const allFeatures = [
    { title: 'Doctors', icon: 'doctor' as const, screen: 'Doctors', color: '#2196F3', gradient: ['#2196F3', '#1976D2'] as const, adminOnly: false },
    { title: 'Patients', icon: 'account-group' as const, screen: 'PatientList', color: '#4CAF50', gradient: ['#4CAF50', '#388E3C'] as const, adminOnly: true },
    { title: 'Medicines', icon: 'pill' as const, screen: 'Medicine', color: '#FF9800', gradient: ['#FF9800', '#F57C00'] as const, adminOnly: false },
    { title: 'Lab Reports', icon: 'file-document' as const, screen: 'LabReports', color: '#9C27B0', gradient: ['#9C27B0', '#7B1FA2'] as const, adminOnly: false },
    { title: 'Articles', icon: 'newspaper' as const, screen: 'Articles', color: '#F44336', gradient: ['#F44336', '#D32F2F'] as const, adminOnly: false },
  ];

  // Filter features based on user role
  const features = allFeatures.filter(feature => 
    !feature.adminOnly || user?.role === 'admin'
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      <LinearGradient
        colors={['#6200ee', '#7c4dff']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="account-circle" size={60} color="#fff" />
            </View>
            <View style={styles.userInfo}>
              <Title style={styles.userName}>Hello, {user?.name}!</Title>
              <Paragraph style={styles.userRole}>{user?.role?.toUpperCase()}</Paragraph>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Title style={styles.sectionTitle}>Quick Access</Title>

        <View style={styles.grid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCardContainer}
              onPress={() => navigation.navigate(feature.screen)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={feature.gradient}
                style={styles.featureCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name={feature.icon} size={36} color="#fff" />
                <Paragraph style={styles.featureTitle}>{feature.title}</Paragraph>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <Surface style={styles.tipCard} elevation={2}>
          <View style={styles.tipHeader}>
            <MaterialCommunityIcons name="lightbulb-on" size={28} color="#ff9800" />
            <Title style={styles.tipTitle}>Health Tips</Title>
          </View>
          <View style={styles.tipContent}>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="water" size={20} color="#2196F3" />
              <Paragraph style={styles.tipText}>Drink at least 8 glasses of water daily</Paragraph>
            </View>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="run" size={20} color="#4CAF50" />
              <Paragraph style={styles.tipText}>Exercise for 30 minutes every day</Paragraph>
            </View>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="sleep" size={20} color="#9C27B0" />
              <Paragraph style={styles.tipText}>Get 7-8 hours of quality sleep</Paragraph>
            </View>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="food-apple" size={20} color="#F44336" />
              <Paragraph style={styles.tipText}>Eat fruits and vegetables daily</Paragraph>
            </View>
          </View>
        </Surface>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  userRole: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  sectionTitle: {
    marginLeft: 20,
    marginTop: 30,
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  featureCardContainer: {
    width: '50%',
    padding: 8,
  },
  featureCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureTitle: {
    marginTop: 12,
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  tipCard: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#fff',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  tipContent: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
  },
  tipText: {
    marginLeft: 12,
    flex: 1,
    color: '#444',
    fontSize: 14,
  },
  bottomPadding: {
    height: 20,
  },
});

export default HomeScreen;
