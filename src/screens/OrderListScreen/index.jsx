import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import OrderItem from 'components/order/OrderItem'
import Layout from 'common/Layout'
import SearchBar from 'common/SearchBar'
import { useSelector } from 'react-redux'
import colors from 'constants/colors'

const OrdersListScreen = ({ navigation }) => {
  const restaurantId = useSelector(state => state.authentication.restaurantId)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)

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
        const ordersArray = Array.from(ordersMap.values()).sort((a, b) => {
          return timeToMinutes(a.deliveryTime) - timeToMinutes(b.deliveryTime)
        })
        setOrders(ordersArray)
        setFilteredOrders(ordersArray)
        setLoading(false)
      }, error => {
        console.error("Failed to fetch orders:", error)
        setLoading(false)
      })
    )

    return () => {
      unsubscribes.forEach(unsub => unsub())
    }
  }, [restaurantId])

  const handleSearch = query => {
    if (query.trim() === '') {
      setFilteredOrders(orders)
    } else {
      const lowercasedQuery = query.toLowerCase()
      const filtered = orders.filter(order =>
        order.orderNum.toLowerCase().includes(lowercasedQuery) ||
        order.items.some(item => item.name.toLowerCase().includes(lowercasedQuery))
      )
      setFilteredOrders(filtered)
    }
  }

  if (loading) {
    return (
      <Layout
        title="Orders"
        navigation={navigation}
      >
        <ActivityIndicator size="large" color={colors.theme} />
      </Layout>
    )
  }

  return (
    <Layout
      title="Orders"
      navigation={navigation}
    >
      <SearchBar
        placeholder="Search orders.."
        onSearch={handleSearch}
      />
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderItem order={item} navigation={navigation} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders found</Text>}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
})

export default OrdersListScreen
