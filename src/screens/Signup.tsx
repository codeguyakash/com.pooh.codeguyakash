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

const Signup = () => {
  const [email, setEmail] = useState('codeguyakash.dev@gmail.com');
  const [password, setPassword] = useState('Hello@#123');
  const [name, setName] = useState('Akash');
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [isAndroid, setIsAndroid] = useState(Platform.OS === 'android');

  const navigation: any = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://node-login-auth.vercel.app/api/v1/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      console.log(data);
      if (data.success && data.data) {
        await AsyncStorage.setItem('accessToken', data.data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.data.refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        if (isAndroid) {
          ToastAndroid.show(`${data.message}`, ToastAndroid.SHORT);
          navigation.navigate('Profile');
          return;
        }
        Alert.alert(`${data.message}`, JSON.stringify(data));
      } else {
        if (isAndroid) {
          ToastAndroid.show(
            `❌ ${data.message || 'Unknown error'}`,
            ToastAndroid.SHORT
          );
          return;
        }
        Alert.alert(`❌ ${data.message}`, data.message || 'Unknown error');
      }
    } catch (error: any) {
      Alert.alert('⚠️ Error', error.message);
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
        onPress={handleLogin}
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
