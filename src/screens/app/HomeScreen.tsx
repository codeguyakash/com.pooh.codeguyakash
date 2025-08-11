import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import Card from '../../components/Card';
import { globalStyle } from '../../globalStyle';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { sendMessage } = useSocket();
  const theme = useAppTheme();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);

  useEffect(() => {
    console.log('StatusBar', StatusBar.currentHeight);
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
    console.log(insets);
  }, []);

  const [seed, setSeed] = useState(() =>
    Math.floor(Math.random() * 1e9).toString()
  );
  const data = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSeed(Math.floor(Math.random() * 1e9).toString());
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const handleCard = useCallback((uri: string) => {
    setSelectedUri(uri);
    setIsModalVisible(true);
  }, []);
  const hideModal = () => setIsModalVisible(false);

  const renderItem = useCallback(
    ({ index }: { index: number }) => {
      const uri = `https://robohash.org/${seed}-${index}8a16cd937f269372c26?gravatar=hashed`;
      return (
        <Pressable onPress={() => handleCard(uri)}>
          <Card image={uri} />
        </Pressable>
      );
    },
    [seed, handleCard]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* <Text
        style={[globalStyle.heading, { color: theme.text, marginBottom: 10 }]}>
        Home Screen!
      </Text> */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(i) => String(i)}
        numColumns={2}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        ListEmptyComponent={
          <Text style={{ color: theme.text }}>No Data Available</Text>
        }
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.button, theme.text]}
            progressBackgroundColor="#fff"
            progressViewOffset={10}
          />
        }
        columnWrapperStyle={{ justifyContent: 'center', gap: 10 }}
        contentContainerStyle={{ justifyContent: 'center', gap: 10 }}
      />

      <Modal
        transparent
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={hideModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Pressable
              onPress={hideModal}
              hitSlop={12}
              style={styles.closeIconWrapper}>
              <Text style={styles.closeIconText}>×</Text>
            </Pressable>
            {selectedUri ? (
              <Image
                source={{ uri: selectedUri }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.modalImage,
                  { alignItems: 'center', justifyContent: 'center' },
                ]}>
                <Text>No image</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: 250,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.2,
    borderColor: '#858585ff',
    borderRadius: 10,
  },
  modalImage: { width: '100%', height: 250 },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 0,
    fontSize: 28,
    fontWeight: '300',
  },
  closeIconWrapper: {
    position: 'absolute',
    right: 6,
    top: 6,
    zIndex: 2,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 14,
  },
  closeIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
    minWidth: 16,
  },
});
