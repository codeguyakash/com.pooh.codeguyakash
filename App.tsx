import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './src/navigation/navigationRef';
import messaging from '@react-native-firebase/messaging';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import ForgotScreen from './src/screens/auth/ForgotScreen';

import ChatScreen from './src/screens/app/ChatScreen';
import ProfileScreen from './src/screens/app/ProfileScreen';
import HomeScreen from './src/screens/app/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import DashboardScreen from './src/screens/app/DashboardScreen';
import SettingsScreen from './src/screens/app/SettingsScreen';

import { useNotification } from './src/notification/useNotification';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import ThreeDotMenu from './src/components/ThreeDotMenu';

console.warn = () => null;

const Stack = createStackNavigator();

function AppNavigation(): React.JSX.Element {
  const { isAuthenticated, loading } = useAuth();
  const theme = useAppTheme();
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

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
        },
        headerRightContainerStyle: { paddingRight: 12 },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerRight: () => <ThreeDotMenu />,
      }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: 'Home',
            }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={({ route }: any) => ({
              title: route.params?.name || 'Profile',
            })}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{
              title: 'Chat',
            }}
          />
          <Stack.Screen
            name="DashboardScreen"
            component={DashboardScreen}
            options={{
              title: 'Dashboard',
            }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{
              title: 'Settings',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotScreen"
            component={ForgotScreen}
            options={{
              headerShown: false,
            }}
          />
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
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <AuthProvider>
                <AppNavigation />
              </AuthProvider>
            </NavigationContainer>
          </SafeAreaProvider>
        </ThemeProvider>
      </ToastProvider>
    </SocketProvider>
  );
}

export default App;
