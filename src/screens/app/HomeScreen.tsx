import {
  SafeAreaView,
  StyleSheet,
  Text,
  Modal,
  View,
  Pressable,
} from 'react-native';
import React, { useEffect } from 'react';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import { fonts } from '../../utils/typography';

const HomeScreen = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const { sendMessage } = useSocket();
  const theme = useAppTheme();
  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Header title="Home Screen" />
      <Text
        style={{
          color: theme.text,
          textAlign: 'center',
          fontFamily: fonts.bold,
          fontSize: 20,
          marginTop: 20,
        }}>
        Welcome to the Home Screen!
      </Text>
      <Pressable onPress={() => setIsModalVisible(true)}>
        <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>
          Show Modal
        </Text>
      </Pressable>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable onPress={() => setIsModalVisible(false)}>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                Close
              </Text>
            </Pressable>
            <View>
              <Text
                style={{
                  color: theme.text,
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                This is a Modal!
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    height: '80%',
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    overflow: 'hidden',
  },
});
