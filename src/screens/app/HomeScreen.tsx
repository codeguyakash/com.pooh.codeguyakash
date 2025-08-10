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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from 'react';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import Card from '../../components/Card';
import groupedData from '../../grouped-data.json';
import { useToast } from '../../context/ToastContext';

const sectionData: any = groupedData;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { sendMessage } = useSocket();
  const { showToast } = useToast();
  const theme = useAppTheme();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('StatusBar', StatusBar.currentHeight);
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
    console.log(insets);
  }, []);
  const data = new Array(20).fill(null);

  const handleCard = (index: any) => {
    setIsModalVisible(true);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

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
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <View style={{ height: 650 }}>
        <FlatList
          data={data}
          renderItem={renderCard}
          keyExtractor={(_, index) => {
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
          refreshing={refreshing}
          onRefresh={onRefresh}
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
                top: 0,
                fontSize: 28,
              }}>
              ×
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
    backgroundColor: 'rgba(91, 91, 91, 0.2)',
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
