import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from 'constants/colors';
const OrderItemHeader = ({ orderNumber, deliveryTime }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.orderNumber}>Order
        <Text style={{ color: colors.theme }}>{orderNumber}</Text>
      </Text>
      <Text style={styles.location}>{deliveryTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
    paddingHorizontal: 10,
    backgroundColor: colors.bgExtraLight,
    borderRadius: 10,
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#646464'
  },
  location: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.theme
  },
});

export default OrderItemHeader;
