import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ItemWithQty from './ItemWithQty'
import colors from 'constants/colors'
import CustomButton from 'common/CustomButton'
import StatusToggle from './StatusToggle'

const subtract30Minutes = (timeStr) => {
  let [hours, minutes] = timeStr.split(':').map(Number)
  let date = new Date()
  date.setHours(hours)
  date.setMinutes(minutes - 30)

  let newHours = date.getHours()
  let newMinutes = date.getMinutes()
  if (newMinutes < 0) {
    newMinutes += 60
    newHours -= 1
  }
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
}

const OrderItem = ({ order, navigation }) => {
  const [variant, setVariant] = useState('acceptReject') // default variant
  const adjustedDeliveryTime = subtract30Minutes(order.deliveryTime)

  const handleAccept = () => {
    console.log('Order Accepted:', order.id)
    setVariant('manage') // Change to 'manage' variant
  }

  const handleReject = () => {
    console.log('Order Rejected:', order.id)
  }

  const handleManage = () => {
    navigation.navigate('OrderDetailScreen', { orderId: order.id })
  }

  return (
    <View style={styles.orderItemContainer}>
      {/* Top row with Order # and location */}
      <View style={styles.topRow}>
        <View style={styles.headerContainer}>
          <Text style={styles.orderNumber}>Order
            <Text style={{ color: colors.theme }}> #{order.orderNum}</Text>
          </Text>
          <Text style={styles.location}>{adjustedDeliveryTime}</Text>
        </View>
      </View>

      {/* Middle row with order details */}
      <View style={styles.middleRow}>
        {order.items.map((item, index) => <ItemWithQty key={index} style={styles.item} itemName={item.name} itemQty={item.quantity} />)}
      </View>

      {/* Bottom row with action buttons or update status buttons */}
      <>
        <View style={styles.statusContainer}>
          <View>
            <Text style={styles.updateText}>Update Status</Text>
          </View>
          <StatusToggle style={styles.toggle} orderId={order.id} />
        </View>
        <CustomButton icon title="Manage Order" onPress={handleManage} style={[styles.buttonText, { marginHorizontal: 8 }]} />
      </>
    </View>
  )
}

const styles = StyleSheet.create({
  orderItemContainer: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 10,
    marginBottom: 16,
  },
  headerContainer: {
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
  item: {
    marginBottom: 20,
  },
  middleRow: {
    marginHorizontal: 10,
  },
  updateText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'gray',
  },
  manageButton: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 10,
    gap: 4,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
})

export default OrderItem
