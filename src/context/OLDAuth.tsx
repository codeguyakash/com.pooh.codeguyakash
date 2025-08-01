import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useToast } from './ToastContext';
import { tokenRefresh, verifyAccessToken } from '../api/modules/authApi';

const Auth = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          navigation.navigate('Login' as never);
          return;
        }

        const isValid = await verifyAccessToken(accessToken);

        if (isValid) {
          navigation.navigate('Profile' as never);
        } else {
          throw new Error('Access token invalid');
        }
      } catch (error) {
        console.warn('Access token invalid, trying refresh...');

        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          const payload = { refreshToken };

          const refreshResponse = await tokenRefresh(payload);

          const newAccess = refreshResponse.data?.data?.accessToken;
          const newRefresh = refreshResponse.data?.data?.refreshToken;

          if (!newAccess || !newRefresh) {
            throw new Error('Invalid refresh response');
          }

          await AsyncStorage.setItem('accessToken', newAccess);
          await AsyncStorage.setItem('refreshToken', newRefresh);

          showToast('Session refreshed. Logging in...');
          navigation.navigate('Profile' as never);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          showToast('Session expired. Please log in again.');
          await AsyncStorage.clear();
          navigation.navigate('Login' as never);
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ff9100ff" />
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
