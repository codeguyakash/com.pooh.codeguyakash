import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { navigationRef } from './src/navigation/navigationRef';

import messaging from '@react-native-firebase/messaging';

import Register from './src/screens/auth/Register';
import Login from './src/screens/auth/Login';

import ChatScreen from './src/screens/app/ChatScreen';
import Profile from './src/screens/app/Profile';
import Home from './src/screens/app/Home';
import Splash from './src/screens/Splash';

import { useNotification } from './src/notification/useNotification';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';

console.warn = () => null;

const Stack = createStackNavigator();

function AppNavigation(): React.JSX.Element {
  const { isAuthenticated, loading } = useAuth();
  useNotification();

  useEffect(() => {
    async function setupChannel() {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setBackgroundMessageHandler(
        async (remoteMessage: any) => {
          console.log('📩 Background FCM:', remoteMessage);
        }
      );
    }
    setupChannel();

    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      console.log('📩 Foreground FCM:', remoteMessage);
      console.log('FCM Message Data:', {
        body: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
      });
    });

    return unsubscribe;
  }, []);

  if (loading) return <Splash />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Home" component={Home} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <SocketProvider>
      <ToastProvider>
        <ThemeProvider>
          <NavigationContainer ref={navigationRef}>
            <AuthProvider>
              <AppNavigation />
            </AuthProvider>
          </NavigationContainer>
        </ThemeProvider>
      </ToastProvider>
    </SocketProvider>
  );
}

export default App;
