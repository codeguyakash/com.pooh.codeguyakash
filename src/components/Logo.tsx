import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import logo from '../assets/icons/pooh.png';

const Logo = () => {
  return (
    <View>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    borderRadius: 45,
  },
});
