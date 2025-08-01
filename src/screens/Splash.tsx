import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Text, Easing } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import logo from '../assets/icons/logo.png';

const Splash = () => {
  const theme = useAppTheme();
  const bounceValue = useRef(new Animated.Value(0)).current;
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -20,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 10,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const dots = '.'.repeat(dotCount).padEnd(3, ' ');

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
      <Text style={[styles.text, { color: theme.text }]}>
        Loading
        <Text style={styles.dots}>{dots}</Text>
      </Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    color: '#222',
  },
  dots: {
    fontFamily: 'Inter-Regular',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
});
