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
import ManageScheduleScreen from 'screens/BusinessScreen/ManageScheduleScreen';

const MenuStack = createStackNavigator();
const OrderListStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const BusinessStack = createStackNavigator();


export const OrderListStackScreen = () => (

    <OrderListStack.Navigator
        screenOptions={{
            headerBackTitleVisible: false, // Hides the back title next to the back button (iOS)
            gestureEnabled: true, // Enable gesture navigation
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
        }}
    >
        <OrderListStack.Screen
            name="OrderListScreen"
            component={OrderListScreen}
        />
        <OrderListStack.Screen
            name="OrderDetailScreen"
            component={OrderDetailScreen}
        />
    </OrderListStack.Navigator>
);

export const BusinessStackScreen = () => (
    <BusinessStack.Navigator
        screenOptions={{
            gestureEnabled: true, // Enable gesture navigation
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
        }}
    >
        <BusinessStack.Screen
            name="BusinessScreen"
            component={BusinessScreen}
        />
        <BusinessStack.Screen
            name="ManageScheduleScreen"
            component={ManageScheduleScreen}
        />
    </BusinessStack.Navigator>
);

export const MenuStackScreen = () => (

    <MenuStack.Navigator
        screenOptions={{
            headerBackTitleVisible: false, // Hides the back title next to the back button (iOS)
            gestureEnabled: true, // Enable gesture navigation
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
        }}
    >
        <MenuStack.Screen
            name="MenuScreen"
            component={MenuScreen}
        />
        <MenuStack.Screen
            name="EditItemScreen"
            component={EditItemScreen}
        />
    </MenuStack.Navigator>
);

export const ProfileStackScreen = () => (
    <ProfileStack.Navigator
        screenOptions={{
            gestureEnabled: true, // Enable gesture navigation
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
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
        />
    </ProfileStack.Navigator>
);


const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    headerSmallTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    }
})
