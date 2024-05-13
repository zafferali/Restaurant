import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, Text } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import OrderItem from 'components/order/OrderItem'
import Layout from 'common/Layout'
import SearchBar from 'common/SearchBar'
import { useSelector } from 'react-redux'

const OrdersListScreen = ({ navigation }) => {
  const restaurantId = useSelector(state => state.authentication.restaurantId)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Helper function to convert time string "HH:mm" to total minutes from midnight
  const timeToMinutes = time => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  useEffect(() => {
    const restaurantRef = firestore().doc(`restaurants/${restaurantId}`)
    const statuses = ['received', 'ready']
    const queries = statuses.map(status =>
      firestore()
        .collection('orders')
        .where('orderStatus', '==', status)
        .where('restaurant', '==', restaurantRef)
    )

    let ordersMap = new Map()

    const unsubscribes = queries.map(query =>
      query.onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(change => {
            const order = { id: change.doc.id, ...change.doc.data() }

            if (change.type === "added" || change.type === "modified") {
              ordersMap.set(order.id, order)
            } else if (change.type === "removed") {
              ordersMap.delete(order.id)
            }
          })
          // Convert the map back to an array for rendering, sorting by deliveryTime
          const ordersArray = Array.from(ordersMap.values()).sort((a, b) => {
            return timeToMinutes(a.deliveryTime) - timeToMinutes(b.deliveryTime)
          })
          setOrders(ordersArray)
          setLoading(false)
        }, 
        error => {
          console.error("Failed to fetch orders:", error)
          setLoading(false)
        }
      )
    )

    return () => {
      unsubscribes.forEach(unsub => unsub()) 
    }
  }, [restaurantId])

  return (
    <Layout
      title="Orders"
      navigation={navigation}
    >
      <SearchBar
        placeholder="Search orders.."
        onSearch={(query) => {
          console.log(query)
        }}
      />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderItem order={item} navigation={navigation} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => <Text>No orders found.</Text>}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 20,
    paddingBottom: 20,
  },
})

export default OrdersListScreen