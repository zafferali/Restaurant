import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { MenuStackScreen, OrderListStackScreen, ProfileStackScreen, BusinessStackScreen } from './StackNavigator';
import { View, StyleSheet, Image, Text } from 'react-native';
import colors from '../constants/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.menuContainer,
        headerShown: false,
      }}
    >
      {/* Home */}
      <Tab.Screen name="Home" component={OrderListStackScreen}
        options={({ route }) => ({
          tabBarStyle: {
            display: getFocusedRouteNameFromRoute(route) === 'OrderDetailScreen' ? 'none' : 'flex',
            height: 70,
          },
          tabBarIcon: ({ focused }) => (
            <View style={styles.menuItem}>
              <Image
                source={require('images/orders-icon.png')}
                resizeMode='contain'
                style={[styles.menuIcon, { tintColor: focused ? colors.theme : colors.textLight }]} />
              <Text style={[styles.menuText, { color: focused ? colors.theme : colors.textLight }]}>Home</Text>
            </View>
          )
        })}
      />

      {/* Business */}
      <Tab.Screen name="Business" component={BusinessStackScreen}
        options={({route}) => ({
          tabBarStyle: {
            display: getFocusedRouteNameFromRoute(route) === 'ManageScheduleScreen' ? 'none' : 'flex',
            height: 70,
          },
          tabBarIcon: ({ focused }) => (
            <View style={styles.menuItem}>
              <Image
                source={require('images/dollar-icon.png')}
                resizeMode='contain'
                style={[styles.menuIcon, { tintColor: focused ? colors.theme : colors.textLight }]} />
              <Text style={[styles.menuText, { color: focused ? colors.theme : colors.textLight }]}>Business</Text>
            </View>
          )
        })}
      />

      {/* Menu */}
      <Tab.Screen name="Menu" component={MenuStackScreen}
        options={({ route }) => ({
          tabBarStyle: {
            display: getFocusedRouteNameFromRoute(route) === 'EditItemScreen' ? 'none' : 'flex',
            height: 70,
          },
          tabBarIcon: ({ focused }) => (
            <View style={styles.menuItem}>
              <Image
                source={require('images/home-icon.png')}
                resizeMode='contain'
                style={[styles.menuIcon, { tintColor: focused ? colors.theme : colors.textLight }]} />
              <Text style={[styles.menuText, { color: focused ? colors.theme : colors.textLight }]}>Menu</Text>
            </View>
          )
        })}
      />


      {/* Profile */}
      <Tab.Screen name="Profile" component={ProfileStackScreen}
        options={({ route}) => ({
          tabBarStyle: {
            display: getFocusedRouteNameFromRoute(route) === 'SettingsScreen' ? 'none' : 'flex',
            height: 70,
          },
          tabBarIcon: ({ focused }) => (
            <View style={styles.menuItem}>
              <Image
                source={require('images/user-icon.png')}
                resizeMode='contain'
                style={[styles.menuIcon, { tintColor: focused ? colors.theme : colors.textLight }]} />
              <Text style={[styles.menuText, { color: focused ? colors.theme : colors.textLight }]}>Profile</Text>
            </View>
          )
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    height: 70,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  menuItem: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuText: {
    fontSize: 14,
    color: colors.textLight,
  },
});

export default BottomTabNavigator;


