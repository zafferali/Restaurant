import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const Card = ({title, description, image, style}) => (
  <View style={[styles.card, style]}>
    {image && <Image source={image} style={styles.image} />}
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {height: 0, width: 0},
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Card;
