import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from 'screens/Auth/LoginScreen';
import ForgotPasswordScreen from 'screens/Auth/ForgotPasswordScreen';

const AuthStack = createStackNavigator();

export const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
    <AuthStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);
