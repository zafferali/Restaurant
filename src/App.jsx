import React, {useState} from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AuthStackNavigator } from './navigation/AuthStackNavigator';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <NavigationContainer>
        {isAuthenticated ? <BottomTabNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({

});

export default App;
