import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';

const ChatScreen = () => {
  const { sendMessage, lastMessage } = useSocket();
  const theme = useAppTheme();
  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
  }, []);

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (lastMessage) {
      console.log('🆕 New incoming message:', lastMessage);
    }
  }, [lastMessage]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage({ text: message, timestamp: Date.now() });
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Chat Screen" />
        <TextInput
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
          style={{
            borderWidth: 1,
            marginVertical: 10,
            padding: 10,
          }}
        />
        <Button title="Send" onPress={handleSend} />
        {lastMessage && (
          <View style={{ marginTop: 20 }}>
            <Text>Last Message: {lastMessage.text}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    // marginTop: 10,
    // paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
