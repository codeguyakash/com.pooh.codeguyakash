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
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../assets/icons/logo.png';
import { RegisterRequest } from '../../types/apiTypes';
import { register } from '../../api/modules/authApi';
import { useAppTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { navigate, navigationRef } from '../../navigation/navigationRef';
import { useNotification } from '../../notification/useNotification';
import { useSocket } from '../../context/SocketContext';

const Register = () => {
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
        const message = response.message || 'Registration successful';
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
          onPress={() =>
            handleSignup(email, password, name, fcmToken, setLoading)
          }
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Register</Text>
          )}
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.text }}>
          Already have an account?{' '}
          <Text
            style={{ color: theme.button, fontWeight: 'bold' }}
            onPress={() => navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Register;

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
