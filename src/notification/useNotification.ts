import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { update } from '../api/modules/authApi';
import { UpdateUserRequest } from '../types/apiTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const requestNotificationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('Notification permission granted');
  } else {
    console.log('Notification permission denied');
  }
};

const getToken = async () => {
  try {
    let userId = String(await AsyncStorage.getItem('userId'));

    let storedToken = String(await AsyncStorage.getItem('fcm_token'));
    console.log('FCM Token:', storedToken, !storedToken);

    const isValidStoredToken =
      storedToken &&
      storedToken !== 'null' &&
      storedToken !== 'undefined' &&
      storedToken.trim() !== '';

    console.log(
      'FCM Token from Storage:',
      storedToken,
      'Valid:',
      isValidStoredToken
    );

    if (isValidStoredToken) {
      console.log('@FCM Token Already Exists: Skip API', storedToken);
      return;
    }

    const token = await messaging().getToken();
    if (token) {
      const payload: UpdateUserRequest = {
        name: '',
        email: '',
        role: '',
        is_verified: null,
        fcm_token: token,
        id: Number(userId),
      };

      const res = await update(payload);
      console.log('Updated Successfully:', res);
    } else {
      console.log('No FCM token available');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const useNotification = () => {
  useEffect(() => {
    requestNotificationPermission();
    getToken();
  }, []);
};
