import { View } from 'react-native';
import { useEffect } from 'react';
import Menu from '../components/Menu';
import { styles } from '../globalStyles';

const Home = ({ navigation }: any) => {
  useEffect(() => {
    console.log(navigation);
    navigation.setOptions({
      headerTitle: 'Home',
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

export default Home;
