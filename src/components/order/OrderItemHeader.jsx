import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from 'constants/colors';
const OrderItemHeader = ({ orderNumber, location }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.orderNumber}>Order
        <Text style={{ color: colors.theme }}>{orderNumber}</Text>
      </Text>
      <Text style={styles.location}>{location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
    padding: 10,
    backgroundColor: colors.bgExtraLight,
    borderRadius: 10,
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  location: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OrderItemHeader;
