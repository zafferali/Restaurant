import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from 'constants/colors';
const Menu = ({ onNavigate }) => {
  // Dummy navigation functions
  const navigateToHome = () => onNavigate('Home');
  const navigateToBusiness = () => onNavigate('Business');
  const navigateToProfile = () => onNavigate('Profile');

  return (
    <View style={styles.menuContainer}>
      {/* Home Button */}
      <TouchableOpacity onPress={navigateToHome} style={styles.menuItem}>
        {/* Placeholder for the icon, replace with Image component later */}
        <Image source={require('images/home-icon.png')} style={styles.menuIcon}/>
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>

      {/* Business Button */}
      <TouchableOpacity onPress={navigateToBusiness} style={styles.menuItem}>
        {/* Placeholder for the icon, replace with Image component later */}
        <Image source={require('images/dollar-icon.png')} style={styles.menuIcon}/>
        <Text style={styles.menuText}>Business</Text>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity onPress={navigateToProfile} style={styles.menuItem}>
        {/* Placeholder for the icon, replace with Image component later */}
        <Image source={require('images/user-icon.png')} style={styles.menuIcon}/>
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
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
  // Add styles for your icons
});

export default Menu;
