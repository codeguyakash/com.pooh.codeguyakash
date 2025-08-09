import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  View,
  Text,
  SectionList,
} from 'react-native';
import React, { useEffect } from 'react';
import { navigationRef } from '../../navigation/navigationRef';
import { useSocket } from '../../context/SocketContext';
import { useAppTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';

import Card from '../../components/Card';
import groupedData from '../../grouped-data.json';

const sectionData: any = groupedData;

const HomeScreen = () => {
  const { sendMessage } = useSocket();
  const theme = useAppTheme();
  useEffect(() => {
    console.log('StatusBar', StatusBar.currentHeight);
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
  }, []);
  const data = new Array(50).fill(null);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Header title="Home Screen" />

      <FlatList
        data={data}
        renderItem={({ item, index }) => <Card key={index} />}
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

      <View style={{ height: 560 }}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1, flexWrap: 'wrap' }}>
              <Card key={index} />
            </View>
          )}
          keyExtractor={(_, index) => {
            console.log(index, 'index');
            return index.toString();
          }}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});

{
  /* <View style={{ height: 600 }}>
        <SectionList
          nestedScrollEnabled
          sections={sectionData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Text
              style={{
                color: theme.text,
                paddingHorizontal: 10,
                fontSize: 16,
              }}>
              {item}
            </Text>
          )}
          renderSectionHeader={({ section }) => (
            <Text
              style={{
                fontWeight: 'bold',
                color: '#000',
                margin: 2,
                borderRadius: 5,
                fontSize: 20,
                backgroundColor: '#fff',
                padding: 10,
              }}>
              {section.type}
            </Text>
          )}
        />
      </View> */
}
