import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import OrderItemHeader from './OrderItemHeader';
import ItemWithQty from './ItemWithQty';
import colors from 'constants/colors';
import CustomButton from 'common/CustomButton';
import StatusToggle from './StatusToggle';

const OrderItem = ({ order, navigation }) => {
  const [variant, setVariant] = useState('acceptReject'); // default variant

  const handleAccept = () => {
    console.log('Order Accepted:', order.id);
    setVariant('manage'); // Change to 'manage' variant
  };

  const handleReject = () => {
    console.log('Order Rejected:', order.id);
  };

  const handleManage = () => {
    navigation.navigate('OrderDetailScreen', { orderNum: 'Order #301'  })
  };

  // Component to render the update status buttons
  const UpdateStatusButtons = () => (
    <View style={styles.updateStatusContainer}>
      <TouchableOpacity style={styles.updateButton}>
        <Text>Food Preparing</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.updateButton}>
        <Text>Ready for Pickup</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.orderItemContainer}>
      {/* Top row with Order # and location */}
      <View style={styles.topRow}>
        <OrderItemHeader orderNumber="#301" location="IIT Delhi" />
      </View>

      {/* Middle row with order details */}
      <View style={styles.middleRow}>
        <ItemWithQty style={styles.item} itemName={"Pizza"} itemQty={"2"}/>
        <ItemWithQty style={styles.item} itemName={"Brownie"} itemQty={"1"}/>
      </View>

      {/* Bottom row with action buttons or update status buttons */}
      <View style={styles.bottomRow}>
        {variant === 'acceptReject' ? (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleAccept}>
              <Image source={require('images/tick.png')} style={styles.icon}/>
              <Text style={styles.buttonText}>Accept Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={handleReject}>
              <Image source={require('images/x.png')} style={styles.icon}/>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.statusContainer}>
              <View>
                <Text >Update Status</Text>
              </View>
              <StatusToggle style={styles.toggle}/>
            </View>
            <CustomButton icon title="Manage Order" onPress={handleManage} style={styles.buttonText}/>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderItemContainer: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 10,
    marginBottom: 16,
  },
  topRow: {
    // styles for top row
  },
  item: {
    marginBottom: 20,
  },
  middleRow: {
    // styles for middle row
  },
  bottomRow: {
    // styles for bottom row
  },
  updateStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  updateButton: {
    backgroundColor: 'lightblue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  manageButton: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center', // Center the button if alone in the row
  },
  manageButtonText: {
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    gap: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggle: {
    flex: 2
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,

  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
// Add specific styles for accept and reject buttons if needed
  acceptButton: {
    backgroundColor: colors.theme,
    flex: 2,
  },
  rejectButton: {
    backgroundColor: colors.danger,
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
  }
});

export default OrderItem;