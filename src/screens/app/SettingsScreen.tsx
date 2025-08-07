import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import ThreeDotMenu from '../../components/ThreeDotMenu';
import Header from '../../components/Header';

const SettingsScreen = () => {
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
        <Header title="Settings Screen" />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    // marginTop: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
