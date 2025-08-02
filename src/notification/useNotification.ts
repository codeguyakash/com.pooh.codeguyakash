import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { update } from '../api/modules/authApi';
import { UpdateUserRequest } from '../types/apiTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '../context/ToastContext';

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
  //   const { showToast } = useToast();
  try {
    let userId = String(await AsyncStorage.getItem('userId'));
    let fcm_token = String(await AsyncStorage.getItem('fcm_token'));

    if (fcm_token) {
      console.log('FCM token already exists:', fcm_token);
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
      console.log('Updated successfully:', res);
    } else {
      console.log('No FCM token available');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    // showToast('Failed to update FCM token. Please try again later.');
  }
};

export const useNotification = () => {
  useEffect(() => {
    requestNotificationPermission();
    getToken();
  }, []);
};
