import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const Tab = ({onPress, title, isActive}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, isActive && styles.activeTab]}>
    <Text style={[styles.text, isActive && styles.activeText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1E90FF',
  },
  text: {
    fontSize: 16,
    color: 'grey',
  },
  activeText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});

export default Tab;
