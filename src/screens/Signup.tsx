import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  Platform,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/icons/logo.png';
import { RegisterRequest } from '../types/apiTypes';
import { register } from '../api/modules/authApi';

const Signup = () => {
  const [email, setEmail] = useState('codeguyakash.dev@gmail.com');
  const [password, setPassword] = useState('Hello@#123');
  const [name, setName] = useState('Akash');
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [isAndroid, setIsAndroid] = useState(Platform.OS === 'android');

  const navigation: any = useNavigation();

  const handleSignup = async (
    email: string,
    password: string,
    name: string,
    setLoading: (v: boolean) => void
  ) => {
    setLoading(true);
    const payload: RegisterRequest = { name, email, password };

    try {
      const response = await register(payload);

      console.log('Signup Response:', response);

      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;

        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        const message = response.message || 'Registration successful';
        if (isAndroid) {
          ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
          Alert.alert('✅ Registration Success', message);
        }
        navigation.navigate('Profile' as never);
      } else {
        const errorMsg = response.message || 'Registration failed';
        if (isAndroid) {
          ToastAndroid.show(`${errorMsg}`, ToastAndroid.SHORT);
        } else {
          Alert.alert('Registration Failed', errorMsg);
        }
      }
    } catch (error: any) {
      console.log('Axios error:', error);
      console.log('Error response:');

      if (isAndroid) {
        ToastAndroid.show(
          `${error?.response?.data.message}`,
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert('Registration Failed', error?.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.subtitle}>Create your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        autoCapitalize="none"
        onChangeText={setName}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#999"
      />

      <View style={styles.passwordWrapper}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isShowPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={() => setIsShowPassword(!isShowPassword)}
          style={styles.toggleBtn}>
          <Text style={styles.toggleText}>{isShowPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, loading && { backgroundColor: '#999' }]}
        onPress={() => handleSignup(email, password, name, setLoading)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Signup</Text>
        )}
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', marginTop: 20 }}>
        Already Have an account?{' '}
        <Text
          style={{ color: '#ff9100ff', fontWeight: 'bold' }}
          onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </Text>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: 'absolute',
    right: 10,
  },
  toggleText: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#ff9100ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 50,
  },
});
