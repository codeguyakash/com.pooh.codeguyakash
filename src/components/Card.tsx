import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Card = () => {
  let randomId = Math.floor(Math.random() * 1000000000);

  const randomNameGenerator = () => {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let randomName = '';
    for (let i = 0; i < 10; i++) {
      randomName += alphabet.charAt(
        Math.floor(Math.random() * alphabet.length)
      );
    }
    return randomName.charAt(0).toUpperCase() + randomName.slice(1);
  };

  let randomName = randomNameGenerator();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: `https://robohash.org/${randomId}8a16cd937f269372c26?gravatar=hashed`,
          }}
          style={styles.image}
        />
        <View>
          <Text style={{ marginTop: 10 }}>{`Name: ${randomName}`}</Text>
          <Text style={{ marginTop: 10 }}>{`ID: ${randomId}`}</Text>
        </View>
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
    margin: 10,
    width: 200,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderColor: '#cbcbcbff',
    borderWidth: 2,
  },
});
