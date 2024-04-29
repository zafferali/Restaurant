import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AuthStackNavigator } from './navigation/AuthStackNavigator';
import { setCustomText } from 'react-native-global-props';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { requestNotificationPermission } from './utils/permissions';
import { registerDeviceToken } from './notification/notification';

// const customTextProps = {
//   style: {
//     fontFamily: 'Inter-SemiBold'
//   }
// };
// setCustomText(customTextProps);


function App() {
  const {isAuthenticated, restaurantId} = useSelector(state => state.authentication)

  useEffect(() => {
    async function initNotificationService() {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted && isAuthenticated) {
        await registerDeviceToken(restaurantId);
      }
    }

    if (isAuthenticated) {
      initNotificationService();
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification received in the foreground:', remoteMessage);
      Alert.alert(
        remoteMessage.notification.title, // assuming the notification payload contains a title
        remoteMessage.notification.body,  // and a body
        [{ text: 'OK', onPress: () => console.log('Alert closed') }]
      );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background:', remoteMessage);
    });

    return () => {
      unsubscribe(); // This will clean up the foreground notification listener when the component unmounts.
    };
  }, []);
  
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
