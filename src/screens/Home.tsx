import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { navigate } from '../navigation/navigationRef';

const Home = () => {
  return (
    <View>
      <Text>Home</Text>

      <TouchableOpacity
        onPress={() => {
          navigate('Profile');
        }}>
        <Text>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
