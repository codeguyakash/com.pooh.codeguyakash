import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { useAppTheme } from '../context/ThemeContext';

const Card = () => {
  const theme = useAppTheme();
  let randomId = Math.floor(Math.random() * 1000000000);
  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: '#f5f5f5' }]}>
        <Image
          source={{
            uri: `https://robohash.org/${randomId}8a16cd937f269372c26?gravatar=hashed`,
          }}
          style={[styles.image, { borderColor: theme.button }]}
        />
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    margin: 10,
    width: 200,
    height: 200,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 100,
    borderWidth: 2,
  },
});
