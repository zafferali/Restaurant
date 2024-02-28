import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, StatusBar} from 'react-native';
import LoginScreen from './screens/LoginScreen';

function App() {
  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <LoginScreen />
    </>
  );
}

const styles = StyleSheet.create({

});

export default App;
