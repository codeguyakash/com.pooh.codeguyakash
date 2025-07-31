import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BottomTabBar = ({ navigation }: any) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.tabText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Contact')}>
        <Text style={styles.tabText}>Contact</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Setting')}>
        <Text style={styles.tabText}>Setting</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    backgroundColor: '#000',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
  },
});
