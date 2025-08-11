import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterRequest } from '../../types/apiTypes';
import { register } from '../../api/modules/authApi';
import { useAppTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { navigate, navigationRef } from '../../navigation/navigationRef';
import { useNotification } from '../../notification/useNotification';
import { useSocket } from '../../context/SocketContext';
import { globalStyle } from '../../globalStyle';
import Logo from '../../components/Logo';
import Heading from '../../components/Heading';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const theme = useAppTheme();
  const { showToast } = useToast();
  const { sendMessage } = useSocket();
  const { register: authRegister } = useAuth();

  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
  }, []);

  useNotification((token) => {
    setFcmToken(token);
  });

  const handleSignup = async (
    email: string,
    password: string,
    name: string,
    fcmToken: string,
    setLoading: (v: boolean) => void
  ) => {
    setLoading(true);
    const payload: RegisterRequest = {
      name,
      email,
      password,
      fcm_token: fcmToken,
    };

    try {
      const response = await register(payload);
      console.log('Response from register:', response);
      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;

        console.log(accessToken, refreshToken, user);

        await authRegister(accessToken, refreshToken);
        await AsyncStorage.setItem('userId', Number(user.id).toString());
        await AsyncStorage.setItem('userInfo', JSON.stringify(user));
        const message = response.message || 'Registration successful';
        setEmail('');
        setPassword('');
        setName('');
        setFcmToken('');

        showToast(message);
      } else {
        console.error('Registration failed:', response);
        const errorMsg = response.message || 'Registration failed';
        showToast(errorMsg);
      }
    } catch (error: any) {
      console.log('Signup error:', error);

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
        <Heading title=" Create your account" />
        <TextInput
          style={[
            globalStyle.input,
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
          onPress={() =>
            handleSignup(email, password, name, fcmToken, setLoading)
          }
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
          )}
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.text }}>
          Already have an account?{' '}
          <Text
            style={{ color: theme.button, fontWeight: 'bold' }}
            onPress={() => navigate('LoginScreen')}>
            Login
          </Text>
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.text }}>
          <Text
            style={{ color: theme.button, fontWeight: 'bold' }}
            onPress={() => navigate('ForgotScreen')}>
            Forget?
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
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
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
