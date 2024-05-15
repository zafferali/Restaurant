import React, { useEffect } from 'react'
import { StatusBar, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import messaging from '@react-native-firebase/messaging'
import { requestNotificationPermission, promptForSettings } from './utils/permissions'
import { registerDeviceToken } from './notification/notification'
import BottomTabNavigator from './navigation/BottomTabNavigator'
import { AuthStackNavigator } from './navigation/AuthStackNavigator'
import { navigate } from './navigation/navigationService'
import { navigationRef, setNavigationReady } from './navigation/navigationService'


// NotificationHandler component to handle notifications
function NotificationHandler() {
  const { isAuthenticated } = useSelector(state => state.authentication);

  useEffect(() => {
    const initNotificationService = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted && isAuthenticated) {
        await registerDeviceToken();
      } else {
        promptForSettings();
      }
    };

    if (isAuthenticated) {
      initNotificationService();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('Setting up notification handlers...');

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification received in the foreground:', remoteMessage);
      const { screen, orderId } = remoteMessage.data;
      Alert.alert(
        'New Order Received',
        'You have received a new order',
        [{
          text: 'View', onPress: () => {
            console.log('Navigating to:', screen, orderId);
            if (screen && orderId) {
              navigate('Home', {
                screen: 'OrderDetailScreen',
                params: { orderId }
              });
            }
          }
        }]
      );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background:', remoteMessage);
      const { screen, orderId } = remoteMessage.data;
      if (screen && orderId) {
        console.log('Navigating to:', screen, orderId);
        navigate('Home', {
          screen: 'OrderDetailScreen',
          params: { orderId }
        });
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      const { screen, orderId } = remoteMessage.data;
      if (screen && orderId) {
        console.log('Navigating to:', screen, orderId);
        navigate('Home', {
          screen: 'OrderDetailScreen',
          params: { orderId }
        });
      }
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
        const { screen, orderId } = remoteMessage.data;
        if (screen && orderId) {
          console.log('Navigating to:', screen, orderId);
          navigate('Home', {
            screen: 'OrderDetailScreen',
            params: { orderId }
          });
        }
      }
    });

    return () => {
      console.log('Cleaning up notification handlers...');
      unsubscribe(); // Clean up the foreground notification listener when the component unmounts
    };
  }, []);

  return null; // This component does not render anything
}


function App() {
  const { isAuthenticated } = useSelector(state => state.authentication)

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      {isAuthenticated ? <BottomTabNavigator /> : <AuthStackNavigator />}
    </>
  )
}

function Root() {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        console.log('Navigation is ready');
        setNavigationReady();
      }}
    >
      <App />
      <NotificationHandler />
    </NavigationContainer>
  )
}

export default Root
