import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ImageBackground, StatusBar } from 'react-native';
import { TextInput, Button, Title, Text, Surface, IconButton } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      <LinearGradient
        colors={['#6200ee', '#9c4dcc', '#6200ee']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <IconButton icon="hospital-box" size={60} iconColor="#fff" />
            </View>
            <Title style={styles.title}>HealthNative</Title>
            <Text style={styles.subtitle}>Your Health, Our Priority</Text>
          </View>

          <Surface style={styles.card}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.loginText}>Login to continue</Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
              outlineColor="#e0e0e0"
              activeOutlineColor="#6200ee"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
              />}
              outlineColor="#e0e0e0"
              activeOutlineColor="#6200ee"
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Sign In
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Demo Accounts</Text>
              <View style={styles.dividerLine} />
            </View>

            <Surface style={styles.demoContainer}>
              <View style={styles.demoItem}>
                <IconButton icon="shield-account" size={24} iconColor="#6200ee" />
                <View style={styles.demoInfo}>
                  <Text style={styles.demoRole}>Admin Access</Text>
                  <Text style={styles.demoEmail}>admin@health.com</Text>
                </View>
              </View>
              <View style={styles.demoItem}>
                <IconButton icon="account" size={24} iconColor="#03a9f4" />
                <View style={styles.demoInfo}>
                  <Text style={styles.demoRole}>User Access</Text>
                  <Text style={styles.demoEmail}>user@health.com</Text>
                </View>
              </View>
              <Text style={styles.demoPassword}>Password: password</Text>
            </Surface>
          </Surface>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#6200ee',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  demoContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    elevation: 2,
  },
  demoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  demoInfo: {
    flex: 1,
  },
  demoRole: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  demoEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  demoPassword: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default LoginScreen;
