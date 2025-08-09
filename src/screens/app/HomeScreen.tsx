import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  FlatList,
  View,
  Text,
  Pressable,
  Modal,
  Image,
} from 'react-native';
import React, { useEffect } from 'react';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';

import { globalStyle } from '../../globalStyle';

import Card from '../../components/Card';
import groupedData from '../../grouped-data.json';
import { useToast } from '../../context/ToastContext';

const sectionData: any = groupedData;

const HomeScreen = () => {
  const { sendMessage } = useSocket();
  const { showToast } = useToast();
  const theme = useAppTheme();

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  useEffect(() => {
    console.log('StatusBar', StatusBar.currentHeight);
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
  }, []);
  const data = new Array(50).fill(null);

  const handleCard = (index: any) => {
    setIsModalVisible(true);
  };

  const renderCard = ({ index }: { index: number }) => (
    <Pressable onPress={() => handleCard(index)}>
      <Card />
    </Pressable>
  );
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Header title="Home Screen" />
      <FlatList
        data={data}
        renderItem={renderCard}
        horizontal={true}
        keyExtractor={(_, index) => {
          console.log(index, 'index');
          return index.toString();
        }}
        ItemSeparatorComponent={() => <View style={{ width: 0 }} />}
        ListEmptyComponent={
          <Text
            style={{
              color: theme.text,
            }}>
            No Data Available
          </Text>
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />

      <View style={{ height: 600 }}>
        <FlatList
          data={data}
          renderItem={renderCard}
          keyExtractor={(_, index) => {
            console.log(index, 'index');
            return index.toString();
          }}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
          ListEmptyComponent={
            <Text
              style={{
                color: theme.text,
              }}>
              No Data Available
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Modal
        transparent
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text
              onPress={() => setIsModalVisible(false)}
              style={{
                position: 'absolute',
                right: 10,
                top: 8,
              }}>
              ❌
            </Text>
            <Image
              source={{
                uri: `https://robohash.org/${Math.random()}8a16cd937f269372c26?gravatar=hashed`,
              }}
              style={styles.modalImage}
            />
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: 300,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
});
