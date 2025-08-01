import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from './src/screens/Profile';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

import Auth from './src/context/Auth';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <ToastProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
