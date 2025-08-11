import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { randomColor } from '../utils/randomColor';

const Card = ({ image }: { image: string }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <Image
          source={{
            uri: image,
          }}
          style={[
            styles.image,
            { backgroundColor: randomColor() || '#c7c7c7ff' },
          ]}
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
    width: 200,
    height: 200,
    alignContent: 'center',
    justifyContent: 'center',
    borderWidth: 0.2,
    borderColor: '#858585ff',
    borderRadius: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
