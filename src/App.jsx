import React, { useEffect } from 'react'
import { View, ActivityIndicator, StatusBar, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import messaging from '@react-native-firebase/messaging'
import { requestNotificationPermission, promptForSettings } from './utils/permissions'
import { registerDeviceToken } from './notification/notification'
import BottomTabNavigator from './navigation/BottomTabNavigator'
import { AuthStackNavigator } from './navigation/AuthStackNavigator'
import { navigate } from './navigation/navigationService'
import { navigationRef } from './navigation/navigationService'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { setAuthenticated } from './redux/slices/authenticationSlice'
import { updateUser } from './redux/slices/userSlice'
import colors from './constants/colors'

function NotificationHandler() {
  const { isAuthenticated } = useSelector(state => state.authentication)

  useEffect(() => {
    const initNotificationService = async () => {
      const permissionGranted = await requestNotificationPermission()
      if (permissionGranted && isAuthenticated) {
        await registerDeviceToken()
      } else {
        promptForSettings()
      }
    }

    if (isAuthenticated) {
      initNotificationService()
    }
  }, [isAuthenticated])

  useEffect(() => {
    console.log('Setting up notification handlers...')

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification received in the foreground:', remoteMessage)
      const { screen, orderId } = remoteMessage.data
      Alert.alert(
        'New Order Received',
        'You have received a new order',
        [{
          text: 'View', onPress: () => {
            console.log('Navigating to:', screen, orderId)
            if (screen && orderId) {
              navigate('Home', {
                screen: 'OrderDetailScreen',
                params: { orderId }
              })
            }
          }
        }]
      )
    })

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background:', remoteMessage)
      const { screen, orderId } = remoteMessage.data
      if (screen && orderId) {
        console.log('Navigating to:', screen, orderId)
        navigate('Home', {
          screen: 'OrderDetailScreen',
          params: { orderId }
        })
      }
    })

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage)
      const { screen, orderId } = remoteMessage.data
      if (screen && orderId) {
        console.log('Navigating to:', screen, orderId)
        navigate('Home', {
          screen: 'OrderDetailScreen',
          params: { orderId }
        })
      }
    })

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage)
        const { screen, orderId } = remoteMessage.data
        if (screen && orderId) {
          console.log('Navigating to:', screen, orderId)
          navigate('Home', {
            screen: 'OrderDetailScreen',
            params: { orderId }
          })
        }
      }
    })

    return () => {
      console.log('Cleaning up notification handlers...')
      unsubscribe()
    }
  }, [])

  return null
}

function App() {
  const { isAuthenticated, loading } = useSelector(state => state.authentication)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get()
        if (userDoc.exists) {
          const userData = userDoc.data()
          const role = userData.role
          let restaurantId = null
          const numRestaurants = userData.restaurants.length
          if (userData.restaurants && numRestaurants > 0) {
            restaurantId = userData.restaurants[0].id
          }
          dispatch(setAuthenticated({
            userId: user.uid,
            restaurantId,
            role,
            numRestaurants,
            isAuthenticated: true
          }))
          dispatch(updateUser({
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            photoUrl: userData.photoUrl,
          }))
        } else {
          dispatch(setAuthenticated({ userId: null, restaurantId: null, role: null, numRestaurants: 0, isAuthenticated: false }))
        }
      } else {
        dispatch(setAuthenticated({ userId: null, restaurantId: null, role: null, numRestaurants: 0, isAuthenticated: false }))
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.theme} />
      </View>
    )
  }

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      {isAuthenticated ? <BottomTabNavigator /> : <AuthStackNavigator />}
    </>
  )
}

function Root() {
  return (
    <NavigationContainer ref={navigationRef}>
      <App />
      <NotificationHandler />
    </NavigationContainer>
  )
}

export default Root
