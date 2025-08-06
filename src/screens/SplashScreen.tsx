import { View, Animated, StyleSheet, Easing, Text } from 'react-native';
import { useEffect, useRef } from 'react';
import { useAppTheme } from '../context/ThemeContext';
import logo from '../assets/icons/logo.png';

import { displayName as appName } from '../../app.json';

const SplashScreen = () => {
  const theme = useAppTheme();
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -10,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 5,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.Image
        source={logo}
        style={[
          styles.logo,
          {
            transform: [{ translateY: bounceValue }],
          },
        ]}
      />

      <Text style={[{ color: theme.text }, styles.heading]}>
        {appName || 'Pooh'}
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
