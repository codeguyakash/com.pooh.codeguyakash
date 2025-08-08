import { StyleSheet, Text, SafeAreaView, Platform } from 'react-native';
import React from 'react';
import { useAppTheme } from '../context/ThemeContext';
import ThreeDotMenu from './ThreeDotMenu';

const Header = ({ title = 'Screen' }: { title?: string }) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={[styles.container]}>
      <Text style={[styles.heading, { color: theme.text }]}>{title}</Text>
      <ThreeDotMenu iconColor={theme.text} />
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 0,
  },
  heading: {
    fontSize: 24,
    fontWeight: '500',
  },
});
