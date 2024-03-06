import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from 'constants/colors';
import { useNavigation } from '@react-navigation/native';

const Menu = () => {
  const [activeItem, setActiveItem] = useState('home')
  const navigation = useNavigation()

  const menuItems = [
    { id: 'home', text: 'Home', source: require('images/home-icon.png'), activeSource: require('images/home-icon-blue.png'), toScreen: 'OrderListScreen' },
    { id: 'business', text: 'Business', source: require('images/dollar-icon.png'), activeSource: require('images/dollar-icon-blue.png'), toScreen: 'BusinessScreen' },
    { id: 'profile', text: 'Profile', source: require('images/user-icon.png'), activeSource: require('images/user-icon-blue.png'), toScreen: 'ProfileScreen' },
  ];

  const handlePress = (item) => {
    navigation.navigate(item.toScreen)
    setActiveItem(() => item.id);
    console.log(`Pressed item: ${item.id}`);
  };


  return (
    <View style={styles.menuContainer}>
      {menuItems.map(item => (
        <TouchableOpacity key={item.id} onPress={() => handlePress(item)} style={styles.menuItem}>
          <Image source={activeItem === item.id ? item.activeSource : item.source} style={styles.menuIcon}/>
          <Text style={ activeItem === item.id ? styles.menuTextBlue : styles.menuText }>{item.text}</Text>
       </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  menuItem: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuText: {
    fontSize: 14,
    color: colors.textLight,
  },
  menuTextBlue: {
    fontSize: 14,
    color: colors.theme,
  }
});

export default Menu;
