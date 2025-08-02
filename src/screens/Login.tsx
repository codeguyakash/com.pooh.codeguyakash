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
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/icons/logo.png';
import { LoginRequest } from '../types/apiTypes';
import { login } from '../api/modules/authApi';
import { useAppTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { navigate } from '../navigation/navigationRef';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('pixel@codeguyakash.in');
  const [password, setPassword] = useState('Password@#123');
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const theme = useAppTheme();
  const { showToast } = useToast();

  const { login: authLogin } = useAuth();

  useEffect(() => {
    (async () => {})();
  }, []);

  const handleLogin = async (
    email: string,
    password: string,
    setLoading: (v: boolean) => void
  ) => {
    setLoading(true);
    const payload: LoginRequest = { email, password };

    try {
      const response = await login(payload);

      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;

        authLogin(accessToken, refreshToken);
        await AsyncStorage.setItem('userId', Number(user.id).toString());

        const message = response.message || 'Login successful';
        showToast(message);
      } else {
        const errorMsg = response.message || 'Login failed';
        showToast(errorMsg);
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMsg = error.response.data.message;
        console.log('Error message from server:', errorMsg);
        showToast(errorMsg, 3000);
      } else if (error instanceof Error) {
        console.log('Generic error message:', error.message);
        showToast(error.message || 'An error occurred during registration');
      } else {
        showToast('An unknown error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Image source={logo} style={styles.logo} />
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Login to your account
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
          onPress={() => handleLogin(email, password, setLoading)}
          disabled={loading}
          activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.text }}>
          Don't have an account?{' '}
          <Text
            style={{ color: theme.button, fontWeight: 'bold' }}
            onPress={() => navigate('Register')}>
            Register
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 48,
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
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 45,
  },
});
