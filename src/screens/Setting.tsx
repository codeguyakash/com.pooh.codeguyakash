import { View } from 'react-native';
import React, { useEffect } from 'react';

import Menu from '../components/Menu';
import { styles } from '../globalStyles';
const Setting = ({ navigation }: any) => {
  useEffect(() => {
    console.log(navigation);
    navigation.setOptions({
      headerTitle: 'Settings',
      headerShown: true,
      headerTitleStyle: {
        color: 'black',
      },

      headerLeft: () => null,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Menu navigation={navigation} />
    </View>
  );
};

export default Setting;
