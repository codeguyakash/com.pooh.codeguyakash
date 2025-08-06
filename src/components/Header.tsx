import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAppTheme } from '../context/ThemeContext';
import ThreeDotMenu from './ThreeDotMenu';

const Header = ({ title = 'Screen' }: { title?: string }) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container]}>
      <Text style={[styles.heading, { color: theme.text }]}>{title}</Text>
      <ThreeDotMenu iconColor={theme.text} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
