import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import MenuScreen from 'screens/MenuScreen';
import EditItemScreen from 'screens/MenuScreen/EditItemScreen';

import OrderListScreen from 'screens/OrderListScreen';
import OrderDetailScreen from 'screens/OrderListScreen/OrderDetailScreen';

import ProfileScreen from 'screens/ProfileScreen';
import SettingsScreen from 'screens/ProfileScreen/SettingsScreen';

import BusinessScreen from 'screens/BusinessScreen';

const MenuStack = createStackNavigator();
const OrderListStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const BusinessStack = createStackNavigator();


export const MenuStackScreen = () => (

    <MenuStack.Navigator
        screenOptions={{
            headerTitleStyle: styles.headerTitle,
            headerBackTitleVisible: false, // Hides the back title next to the back button (iOS)
            gestureEnabled: true, // Enable gesture navigation
            ...TransitionPresets.SlideFromRightIOS,
        }}
    >
        <MenuStack.Screen
            name="MenuScreen"
            component={MenuScreen}
            options={{ title: 'Menu' }}
        />
        <MenuStack.Screen
            name="EditItemScreen"
            component={EditItemScreen}
            options={{ title: 'Edit Item', headerTitleStyle: styles.headerSmallTitle }}
        />
    </MenuStack.Navigator>
);

export const OrderListStackScreen = () => (

<OrderListStack.Navigator
    screenOptions={{
        headerTitleStyle: styles.headerTitle,
        headerBackTitleVisible: false, // Hides the back title next to the back button (iOS)
        gestureEnabled: true, // Enable gesture navigation
        ...TransitionPresets.SlideFromRightIOS,
    }}
>
    <OrderListStack.Screen
        name="OrderListScreen"
        component={OrderListScreen}
        options={{ title: 'Orders' }}
    />
    <OrderListStack.Screen
        name="OrderDetailScreen"
        component={OrderDetailScreen}
        options={{ title: 'Order #301', headerTitleStyle: styles.headerSmallTitle}}
    />
</OrderListStack.Navigator>
);


export const ProfileStackScreen = () => (
    <ProfileStack.Navigator
        screenOptions={{
            headerTitleStyle: styles.headerTitle,
            gestureEnabled: true, // Enable gesture navigation
            ...TransitionPresets.SlideFromRightIOS,
        }}
    >
        <ProfileStack.Screen 
            name="ProfileScreen" 
            component={ProfileScreen}
            options={{ headerShown: false }}
        />
        <ProfileStack.Screen 
            name="SettingsScreen" 
            component={SettingsScreen}
            options={{ title: 'Settings', headerTitleStyle: styles.headerSmallTitle}}
        />
    </ProfileStack.Navigator>
);

export const BusinessStackScreen = () => (
    <BusinessStack.Navigator
        screenOptions={{
            headerTitleStyle: styles.headerTitle,
            gestureEnabled: true, // Enable gesture navigation
            ...TransitionPresets.SlideFromRightIOS,
    }}
    >
        <BusinessStack.Screen 
            name="BusinessScreen" 
            component={BusinessScreen} 
            options={{ title: 'Business'}}
        />
    </BusinessStack.Navigator>
);

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 38,
        fontWeight: 'bold',
    },
    headerSmallTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    }
})
