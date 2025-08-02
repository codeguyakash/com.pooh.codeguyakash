import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';

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
    const token = await messaging().getToken();
    if (token) {
      console.log('FCM Token:', token);
      // You can send this token to your server or use it as needed
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
