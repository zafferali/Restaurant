import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from 'constants/colors';

const StatusToggle = () => {
  const [activeStatus, setActiveStatus] = useState('Food Preparing');

  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, activeStatus === 'Food Preparing' ? styles.active : null]}
        onPress={() => setActiveStatus('Food Preparing')}
      >
        <Text style={[styles.toggleText, activeStatus === 'Food Preparing' ? styles.active : null ]}>Food Preparing</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, activeStatus === 'Ready for Pickup' ? styles.active : null]}
        onPress={() => setActiveStatus('Ready for Pickup')}
      >
        <Text style={[styles.toggleText, activeStatus === 'Ready for Pickup' ? styles.active : null ]}>Ready for Pickup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0', // Non-active background color
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 18, // Slightly less than container to fit inside padding
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Default non-active color
  },
  active: {
    backgroundColor: colors.theme, // Active background color
    color: 'white',
    // elevation: 2,
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // shadowOffset: { width: 0, height: 3 },
  },
  toggleText: {
    color: colors.theme, // Text color
    fontSize: 12,
    fontWeight: '600'
  },
});

export default StatusToggle;
