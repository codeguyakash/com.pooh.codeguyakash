import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useSocket } from '../context/SocketContext';

const ChatScreen = () => {
  const { sendMessage, lastMessage } = useSocket();
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
    <View style={{ padding: 20 }}>
      <Text>Chat</Text>
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
  );
};

export default ChatScreen;
