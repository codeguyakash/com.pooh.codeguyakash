import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import { globalStyle } from '../../globalStyle';

const AppInfoScreen = () => {
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
        <Text style={[globalStyle.heading, { color: theme.text }]}>
          App Info Screen!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AppInfoScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    // marginTop: 10
    // paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
