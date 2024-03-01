import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, StatusBar} from 'react-native';
import LoginScreen from 'screens/LoginScreen';
import OrderListScreen from 'screens/OrderListScreen'
import OrderDetailScreen from 'screens/OrderListScreen/OrderDetailScreen';
import AppNavigator from './navigation/AppNavigator';


function App() {
  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      {/* <LoginScreen />
      <OrderListScreen /> */}
      <AppNavigator />
    </>
  );
}

const styles = StyleSheet.create({

});

export default App;
