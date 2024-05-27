import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import colors from 'constants/colors';

const ScheduleToggle = ({onPress1, onPress2, style}) => {

    const option1 = 'General';
    const option2 = 'Occasions';
    let [activeStatus, setActiveStatus] = useState(option1);
    const handleOnPress1 = () => {
       setActiveStatus(option1)
       onPress1()
    }

    const handleOnPress2 = () => {
        setActiveStatus(option2) 
        onPress2()
     }
  return (
    <View style={[styles.toggleContainer, style]}>
      <TouchableOpacity
        style={[styles.toggleButton, activeStatus === option1 ? styles.active : null]}
        onPress={() => handleOnPress1()}
      >
        <Text style={[styles.toggleText, activeStatus === option1 ? styles.active : null]}>{option1}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, activeStatus === option2 ? styles.active : null]}
        onPress={() => handleOnPress2()}
      >
        <Text style={[styles.toggleText, activeStatus === option2 ? styles.active : null]}>{option2}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ScheduleToggle

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: 20,
        padding: 4,
        alignSelf: 'center'
    
      },
      toggleButton: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      },
      active: {
        backgroundColor: colors.theme,
        color: 'white',
      },
      toggleText: {
        color: colors.theme,
        fontSize: 14,
        fontWeight: '600'
      },
})