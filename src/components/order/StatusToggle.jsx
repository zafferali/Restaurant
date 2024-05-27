import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import colors from 'constants/colors';
import firestore from '@react-native-firebase/firestore';

const StatusToggle = ({ orderId }) => {
  const option1 = 'Food Preparing';
  const option2 = 'Ready for Pickup';
  let [activeStatus, setActiveStatus] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('orders')
      .doc(orderId)
      .onSnapshot(doc => {
        const status = doc.data()?.orderStatus;
        if (status == 'received') {
          setActiveStatus(option1);
        } else if (status == 'ready') {
          setActiveStatus(option2);
        }
      }, error => {
        console.error("Error fetching order status:", error);
      });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  const handleToggle = (newStatus) => {
    if (newStatus === option2 && activeStatus === option1) {
      Alert.alert(
        "Confirm",
        "Are you sure the food is ready for pickup?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => updateFirestore('ready') }
        ]
      );
    } else if (newStatus === option1 && activeStatus === option2) {
      Alert.alert("Alert", "Please call customer care to change the status.");
    }
  };

  const updateFirestore = async (newStatusKey) => {
    try {
      await firestore()
        .collection('orders')
        .doc(orderId)
        .update({
          orderStatus: newStatusKey
        });
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, activeStatus === option1 ? styles.active : null]}
        onPress={() => handleToggle(option1)}
      >
        <Text style={[styles.toggleText, activeStatus === option1 ? styles.active : null]}>{option1}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, activeStatus === option2 ? styles.active : null]}
        onPress={() => handleToggle(option2)}
      >
        <Text style={[styles.toggleText, activeStatus === option2 ? styles.active : null]}>{option2}</Text>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
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
    fontSize: 12,
    fontWeight: '600'
  },
});

export default StatusToggle;
