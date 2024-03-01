import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import OrderItem from 'components/order/OrderItem'
import Layout from 'common/Layout';
import SearchBar from 'common/SearchBar';

// Dummy data
const orders = [
  { id: 1, title: 'Order #301', description: ['Pizza Margherita', 'Garlic bread'], quantity: [2, 1], status: 'Food Preparing' },
  { id: 2, title: 'Order #302', description: ['Pasta White'], quantity: [1, 1], status: 'Food Preparing' },
  { id: 3, title: 'Order #303', description: ['Biriyani', 'Mushroom'], quantity: [2, 4], status: 'Food Preparing' },
  { id: 4, title: 'Order #304', description: ['Veggie, Toast'], quantity: [4, 8], status: 'Food Preparing' },
  { id: 5, title: 'Order #305', description: ['Pizza Margherita, Garlic bread'], quantity: [6, 8], status: 'Food Preparing' },
  { id: 6, title: 'Order #306', description: 'Pizza Margherita, Garlic bread', quantity: '2, 1', status: 'Food Preparing' },
  { id: 7, title: 'Order #307', description: 'Pizza Margherita, Garlic bread', quantity: '2, 1', status: 'Food Preparing' },
  { id: 8, title: 'Order #308', description: 'Pizza Margherita, Garlic bread', quantity: '2, 1', status: 'Food Preparing' },
  { id: 9, title: 'Order #309', description: 'Pizza Margherita, Garlic bread', quantity: '2, 1', status: 'Food Preparing' },
  // ... Add more dummy orders
];

const OrdersListScreen = ({navigation}) => {
  return (
    <Layout  
     showMenu
     bigTitle="Orders"
     onBackPress={() => console.log('Back button pressed')}
    >
      <SearchBar
        placeholder="Search orders.."
        onSearch={(query) => {
          console.log(query)
        }}
      />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderItem order={item} navigation={navigation}/>}
        contentContainerStyle={styles.list}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  list: {
  paddingTop: 20,
  paddingBottom: 20,
  },
});

export default OrdersListScreen;