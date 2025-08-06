import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { navigate, navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';

const Home = () => {
  const { sendMessage } = useSocket();
  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
  }, []);

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
