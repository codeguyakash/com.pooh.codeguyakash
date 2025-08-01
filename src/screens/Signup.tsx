import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/icons/logo.png';
import { RegisterRequest } from '../types/apiTypes';
import { register } from '../api/modules/authApi';
import { useAppTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Signup = () => {
  const [email, setEmail] = useState('pooh@codeguyakash.in');
  const [password, setPassword] = useState('Password@#123');
  const [name, setName] = useState('Akash');
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const navigation: any = useNavigation();
  const theme = useAppTheme();
  const { showToast } = useToast();

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

      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;

        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        await AsyncStorage.setItem('userId', Number(user.id).toString());

        const message = response.message || 'Registration successful';
        showToast(message);
        navigation.navigate('Profile' as never);
      } else {
        const errorMsg = response.message || 'Registration failed';
        showToast(errorMsg);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      showToast(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Image source={logo} style={styles.logo} />
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Create your account
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          placeholder="Name"
          value={name}
          autoCapitalize="none"
          onChangeText={setName}
          placeholderTextColor={theme.placeholder}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor={theme.placeholder}
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                marginBottom: 0,
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.text,
              },
            ]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isShowPassword}
            placeholderTextColor={theme.placeholder}
          />
          <TouchableOpacity
            onPress={() => setIsShowPassword(!isShowPassword)}
            style={styles.toggleBtn}>
            <Text style={[styles.toggleText, { color: theme.text }]}>
              {isShowPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: loading ? theme.buttonDisabled : theme.button },
          ]}
          onPress={() => handleSignup(email, password, name, setLoading)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Signup</Text>
          )}
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.text }}>
          Already have an account?{' '}
          <Text
            style={{ color: theme.button, fontWeight: 'bold' }}
            onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
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
