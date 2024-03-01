import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from 'screens/LoginScreen'; 
import OrderListScreen from 'screens/OrderListScreen';
import OrderDetailScreen from 'screens/OrderListScreen/OrderDetailScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ header: () => null }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OrderListScreen" component={OrderListScreen} />
        <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
