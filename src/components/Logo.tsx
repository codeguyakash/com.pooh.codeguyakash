import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import logo from '../assets/icons/logo.png';

const Logo = () => {
  return (
    <View>
      <Image source={logo} style={styles.logo} />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 45,
  },
});
