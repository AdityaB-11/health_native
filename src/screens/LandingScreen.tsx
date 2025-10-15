import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import {
  Title,
  Paragraph,
  Button,
  Surface,
  Card,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface LandingScreenProps {
  navigation?: any;
  onContinue?: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation, onContinue }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const features = [
    {
      icon: 'doctor',
      title: 'Expert Doctors',
      description: 'Connect with qualified healthcare professionals across various specializations',
      color: '#4CAF50',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&auto=format&q=80',
    },
    {
      icon: 'file-document-outline',
      title: 'Lab Reports',
      description: 'Upload, store and access your medical reports securely anytime, anywhere',
      color: '#2196F3',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&auto=format&q=80',
    },
    {
      icon: 'pill',
      title: 'Medicine Catalog',
      description: 'Browse extensive medicine database with Indian pricing and availability',
      color: '#FF9800',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop&auto=format&q=80',
    },
    {
      icon: 'newspaper-variant',
      title: 'Health Articles',
      description: 'Stay informed with curated health articles focused on Indian healthcare',
      color: '#9C27B0',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop&auto=format&q=80',
    },
  ];

  const renderFeatureCard = (feature: any, index: number) => (
    <Surface key={index} style={styles.featureCard} elevation={4}>
      <View style={styles.featureImageContainer}>
        <Image
          source={{ uri: feature.image }}
          style={styles.featureImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.featureImageOverlay}
        />
        <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
          <MaterialCommunityIcons name={feature.icon} size={32} color="white" />
        </View>
      </View>
      <View style={styles.featureContent}>
        <Title style={styles.featureTitle}>{feature.title}</Title>
        <Paragraph style={styles.featureDescription}>{feature.description}</Paragraph>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      
      {/* Hero Section */}
      <LinearGradient
        colors={['#1976D2', '#1565C0', '#0D47A1']}
        style={styles.heroSection}
      >
        <Animated.View style={[styles.heroContent, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="medical-bag" size={80} color="white" />
            <Title style={styles.appTitle}>HealthNative</Title>
            <Paragraph style={styles.appTagline}>
              Your Complete Healthcare Companion
            </Paragraph>
          </View>
          
          <View style={styles.heroFeatures}>
            <View style={styles.heroFeatureItem}>
              <MaterialCommunityIcons name="shield-check" size={24} color="white" />
              <Paragraph style={styles.heroFeatureText}>Secure & Private</Paragraph>
            </View>
            <View style={styles.heroFeatureItem}>
              <MaterialCommunityIcons name="clock-fast" size={24} color="white" />
              <Paragraph style={styles.heroFeatureText}>Quick Access</Paragraph>
            </View>
            <View style={styles.heroFeatureItem}>
              <MaterialCommunityIcons name="heart" size={24} color="white" />
              <Paragraph style={styles.heroFeatureText}>Health Focused</Paragraph>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Features Section */}
      <ScrollView 
        style={styles.featuresSection}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Powerful Features</Title>
          <Paragraph style={styles.sectionSubtitle}>
            Everything you need for better healthcare management
          </Paragraph>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => renderFeatureCard(feature, index))}
        </View>

        {/* Benefits Section */}
        <Surface style={styles.benefitsSection} elevation={2}>
          <Title style={styles.benefitsTitle}>Why Choose HealthNative?</Title>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
              <View style={styles.benefitContent}>
                <Title style={styles.benefitTitle}>Indian Healthcare Focus</Title>
                <Paragraph style={styles.benefitDescription}>
                  Designed specifically for Indian healthcare system and practices
                </Paragraph>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
              <View style={styles.benefitContent}>
                <Title style={styles.benefitTitle}>Easy to Use</Title>
                <Paragraph style={styles.benefitDescription}>
                  Intuitive interface designed for users of all ages
                </Paragraph>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
              <View style={styles.benefitContent}>
                <Title style={styles.benefitTitle}>Comprehensive Care</Title>
                <Paragraph style={styles.benefitDescription}>
                  From consultations to medicines, everything in one place
                </Paragraph>
              </View>
            </View>
          </View>
        </Surface>

        {/* User Types Section */}
        <View style={styles.userTypesSection}>
          <Title style={styles.sectionTitle}>Perfect For</Title>
          
          <View style={styles.userTypesGrid}>
            <Card style={styles.userTypeCard}>
              <Card.Content style={styles.userTypeContent}>
                <MaterialCommunityIcons name="account" size={48} color="#2196F3" />
                <Title style={styles.userTypeTitle}>Patients</Title>
                <Paragraph style={styles.userTypeDescription}>
                  Manage your health records, book appointments, and stay informed
                </Paragraph>
              </Card.Content>
            </Card>

            <Card style={styles.userTypeCard}>
              <Card.Content style={styles.userTypeContent}>
                <MaterialCommunityIcons name="doctor" size={48} color="#4CAF50" />
                <Title style={styles.userTypeTitle}>Doctors</Title>
                <Paragraph style={styles.userTypeDescription}>
                  Manage patients, appointments, and provide better care
                </Paragraph>
              </Card.Content>
            </Card>

            <Card style={styles.userTypeCard}>
              <Card.Content style={styles.userTypeContent}>
                <MaterialCommunityIcons name="cog" size={48} color="#FF9800" />
                <Title style={styles.userTypeTitle}>Admins</Title>
                <Paragraph style={styles.userTypeDescription}>
                  Manage platform content, doctors, and system administration
                </Paragraph>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* CTA Section */}
        <Surface style={styles.ctaSection} elevation={3}>
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.ctaGradient}
          >
            <MaterialCommunityIcons name="rocket-launch" size={48} color="white" />
            <Title style={styles.ctaTitle}>Ready to Get Started?</Title>
            <Paragraph style={styles.ctaDescription}>
              Join thousands of users managing their health with HealthNative
            </Paragraph>
            
            <View style={styles.ctaButtons}>
              <Button
                mode="contained"
                onPress={() => onContinue ? onContinue() : navigation?.navigate('Login')}
                style={styles.loginButton}
                labelStyle={styles.loginButtonText}
                icon="login"
              >
                Get Started
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => onContinue ? onContinue() : navigation?.navigate('Login')}
                style={styles.demoButton}
                labelStyle={styles.demoButtonText}
                icon="eye"
              >
                Demo Account
              </Button>
            </View>
          </LinearGradient>
        </Surface>

        <View style={styles.footer}>
          <Paragraph style={styles.footerText}>
            HealthNative - Your Complete Healthcare Companion
          </Paragraph>
          <View style={styles.footerBadges}>
            <Chip icon="shield-check" style={styles.footerBadge}>Secure</Chip>
            <Chip icon="heart" style={styles.footerBadge}>Trusted</Chip>
            <Chip icon="star" style={styles.footerBadge}>Rated</Chip>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heroSection: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
  heroFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  heroFeatureItem: {
    alignItems: 'center',
    flex: 1,
  },
  heroFeatureText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  featuresSection: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionHeader: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  featuresGrid: {
    paddingHorizontal: 15,
  },
  featureCard: {
    marginHorizontal: 5,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featureImageContainer: {
    height: 160,
    position: 'relative',
  },
  featureImage: {
    width: '100%',
    height: '100%',
  },
  featureImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  featureIconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    padding: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  benefitsSection: {
    margin: 15,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsList: {
    gap: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitContent: {
    marginLeft: 15,
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  userTypesSection: {
    padding: 15,
  },
  userTypesGrid: {
    gap: 15,
  },
  userTypeCard: {
    borderRadius: 12,
  },
  userTypeContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  userTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 8,
  },
  userTypeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaSection: {
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: 30,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  ctaDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  ctaButtons: {
    gap: 12,
    width: '100%',
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  loginButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoButton: {
    borderColor: 'white',
    borderWidth: 2,
    paddingVertical: 8,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 16,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  footerBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  footerBadge: {
    backgroundColor: 'white',
  },
});

export default LandingScreen;