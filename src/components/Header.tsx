import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React from 'react';
import { useAppTheme } from '../context/ThemeContext';
import ThreeDotMenu from './ThreeDotMenu';

const Header = ({ title = 'Screen' }: { title?: string }) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container]}>
      <StatusBar
        backgroundColor={theme.customColor}
        barStyle={theme.text === '#fff' ? 'light-content' : 'dark-content'}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
