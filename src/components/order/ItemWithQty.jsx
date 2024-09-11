import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from 'constants/colors'

const ItemWithQty = ({ itemName, itemQty }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.itemText}>{itemName}</Text>
      <View style={styles.square}>
        <Text style={styles.number}>{itemQty}</Text>
      </View>
    </View>
  )
}

export default ItemWithQty

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: '#3B3B3B',
    fontSize: 14,
    fontWeight: '600',
  },
  square: {
    width: 50,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 14,
    color: colors.theme,
    fontWeight: '600',
  },
})
