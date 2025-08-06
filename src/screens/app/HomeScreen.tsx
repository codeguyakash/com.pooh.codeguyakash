import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import ThreeDotMenu from '../../components/ThreeDotMenu';

const HomeScreen = () => {
  const { sendMessage } = useSocket();
  const theme = useAppTheme();
  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[{ color: theme.text }, styles.heading]}>Home Screen</Text>
        <ThreeDotMenu
          iconColor="#FFF"
          menuItems={[
            {
              label: 'Chat',
              onPress: () => navigationRef.navigate('ChatScreen'),
            },
            {
              label: 'Settings',
              onPress: () => navigationRef.navigate('SettingsScreen'),
            },
            {
              label: 'Home',
              onPress: () => navigationRef.navigate('HomeScreen'),
            },
            {
              label: 'Dashboard',
              onPress: () => navigationRef.navigate('DashboardScreen'),
            },
            {
              label: 'Profile',
              onPress: () => navigationRef.navigate('ProfileScreen'),
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
