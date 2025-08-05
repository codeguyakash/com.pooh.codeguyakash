import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { navigationRef } from './src/navigation/navigationRef';

import Profile from './src/screens/Profile';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import Splash from './src/screens/Splash';
import { useNotification } from './src/notification/useNotification';

import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();

function AppNavigation(): React.JSX.Element {
  const { isAuthenticated, loading } = useAuth();
  useNotification();

  // ===== Setup Foreground Push Handling =====
  useEffect(() => {
    async function setupChannel() {
      console.log('NOTIFICATION SETUP');
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
  console.log(isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Profile" component={Profile} />
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
    <ToastProvider>
      <ThemeProvider>
        <NavigationContainer ref={navigationRef}>
          <AuthProvider>
            <AppNavigation />
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
