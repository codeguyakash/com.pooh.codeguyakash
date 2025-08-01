import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { navigationRef } from './src/navigation/navigationRef';

import Profile from './src/screens/Profile';
import Login from './src/screens/Login';
import Register from './src/screens/Register';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import Splash from './src/screens/Splash';

const Stack = createStackNavigator();

function AppNavigation(): React.JSX.Element {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Splash />;
  console.log(isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Profile" component={Profile} />
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
