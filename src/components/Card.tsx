import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Card = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: `https://robohash.org/${Math.random()}8a16cd937f269372c26?gravatar=hashed`,
          }}
          style={styles.image}
        />
        <Text style={{ textAlign: 'center', marginTop: 10 }}>
          {`Image ID: ${Date.now()}`}
        </Text>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginVertical: 10,
    height: 200,
    width: '90%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#cbcbcbff',
    borderWidth: 2,
  },
});
