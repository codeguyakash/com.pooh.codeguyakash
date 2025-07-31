import { View } from 'react-native';
import { useEffect } from 'react';
import Menu from '../components/Menu';
import { styles } from '../globalStyles';

const Contact = ({ navigation }: any) => {
  useEffect(() => {
    console.log(navigation);
    navigation.setOptions({
      headerTitle: 'Contact',
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

export default Contact;
