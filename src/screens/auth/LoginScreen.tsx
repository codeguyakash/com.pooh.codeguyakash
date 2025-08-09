import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest } from '../../types/apiTypes';
import { login } from '../../api/modules/authApi';
import { useAppTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { navigate, navigationRef } from '../../navigation/navigationRef';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { globalStyle } from '../../globalStyle';
import Logo from '../../components/Logo';
import Heading from '../../components/Heading';

const LoginScreen = () => {
  const [email, setEmail] = useState('pixel@codeguyakash.in');
  const [password, setPassword] = useState('Password@#123');
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const theme = useAppTheme();
  const { showToast } = useToast();
  const { sendMessage } = useSocket();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
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
        <Logo />
        <Heading title="Login to your account" />
        <TextInput
          style={[
            globalStyle.input,
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
              globalStyle.input,
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
              {isShowPassword ? '🙈' : '🐵'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            globalStyle.button,
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
            onPress={() => navigate('RegisterScreen')}>
            Register
          </Text>
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.text }}>
          <Text
            style={{ color: theme.button, fontWeight: 'bold' }}
            onPress={() => navigate('ForgotScreen')}>
            Forgot Password?
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
