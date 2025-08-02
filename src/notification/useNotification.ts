import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { update } from '../api/modules/authApi';
import { UpdateUserRequest } from '../types/apiTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  } else {
    console.log(
      'Notification permission not required on this platform/version'
    );
  }
};

export const useNotification = (onTokenReceived?: (token: string) => void) => {
  useEffect(() => {
    const init = async () => {
      await requestNotificationPermission();

      try {
        const userId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('fcm_token');

        const isValidStoredToken =
          storedToken &&
          storedToken !== 'null' &&
          storedToken !== 'undefined' &&
          storedToken.trim() !== '';

        if (isValidStoredToken) {
          console.log('FCM token already stored:', storedToken);
          onTokenReceived?.(storedToken);
          return;
        }

        const token = await messaging().getToken();
        if (!token) {
          console.log('No FCM token generated');
          return;
        }

        console.log('🎯 New FCM token:', token);
        await AsyncStorage.setItem('fcm_token', token);
        onTokenReceived?.(token);

        if (userId) {
          const payload: UpdateUserRequest = {
            id: Number(userId),
            name: '',
            email: '',
            role: '',
            is_verified: null,
            fcm_token: token,
          };

          const res = await update(payload);
          console.log('Token synced to API:', res);
        }
      } catch (error) {
        console.error('Error in notification setup:', error);
      }
    };

    init();
  }, []);
};
