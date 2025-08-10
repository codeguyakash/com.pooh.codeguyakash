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
import { useAppTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { navigate, navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { globalStyle } from '../../globalStyle';
import { resetPassword } from '../../api/modules/authApi';
import Logo from '../../components/Logo';
import Heading from '../../components/Heading';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useAppTheme();
  const { showToast } = useToast();
  const { sendMessage } = useSocket();

  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
  }, []);

  const handleForget = async (
    email: string,
    setLoading: (v: boolean) => void
  ) => {
    if (!email) {
      showToast('Please enter your email');
      return;
    }
    try {
      const payload: any = { email };
      const response = await resetPassword(payload);
      if (response.success) {
        const message = response.message || 'Reset successful';
        showToast(message);
        setEmail('');
        setTimeout(() => {
          navigate('LoginScreen');
        }, 2000);
      } else {
        const errorMsg = response.message || 'Reset failed';
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
        <Heading title="Forget Password " />
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

        <TouchableOpacity
          style={[
            globalStyle.button,
            { backgroundColor: loading ? theme.buttonDisabled : theme.button },
          ]}
          onPress={() => handleForget(email, setLoading)}
          disabled={loading}
          activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.text }}>
          <Text
            style={{ color: theme.button, fontWeight: 'bold' }}
            onPress={() => navigate('LoginScreen')}>
            Login
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
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
