import React, { useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AuthStackNavigator } from './navigation/AuthStackNavigator';
import { setCustomText } from 'react-native-global-props';

const customTextProps = {
  style: {
    fontFamily: 'Inter-SemiBold'
  }
};
setCustomText(customTextProps);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={false} />
      <NavigationContainer>
        {isAuthenticated ? <BottomTabNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({

});

export default App;
