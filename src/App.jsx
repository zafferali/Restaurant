import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import CustomButton from 'components/buttons/CustomButton';
import LoginScreen from './screens/Login';

function App() {
  return (
    // <SafeAreaView>
    //   <View style={styles.center}>
    //     <Text style={styles.hello}>BriskIt Restaurant- Initial setup</Text>
    //     <CustomButton />
    //   </View>
    // </SafeAreaView>
    <LoginScreen />
  );
}

const styles = StyleSheet.create({
  hello: {
    color: 'red',
    fontSize: 32,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
