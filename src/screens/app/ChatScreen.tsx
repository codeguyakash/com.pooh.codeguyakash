import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import { globalStyle } from '../../globalStyle';
import chatImage from '../../assets/icons/image.png';

const ChatScreen = () => {
  const { sendMessage, lastMessage } = useSocket();
  const theme = useAppTheme();
  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
  }, []);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
        <View>
          <Image
            source={chatImage}
            style={{ width: '100%', height: 200, marginVertical: 100 }}
            resizeMode="contain"
          />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <TextInput
            style={[
              globalStyle.input,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.text,
              },
            ]}
            placeholder="Type a message"
            value={message}
            autoCapitalize="none"
            onChangeText={setMessage}
            placeholderTextColor={theme.placeholder}
          />

          <TouchableOpacity
            style={[
              globalStyle.button,
              {
                backgroundColor: loading ? theme.buttonDisabled : theme.button,
              },
            ]}
            onPress={() => handleSend()}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.chatText}>Send</Text>
            )}
          </TouchableOpacity>
          {lastMessage && (
            <View style={{ marginTop: 20 }}>
              <Text>Last Message: {lastMessage.text}</Text>
            </View>
          )}
        </View>
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
    // paddingHorizontal: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
