import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert} from 'react-native'
import React from 'react'
import Layout from 'common/Layout'
import colors from 'constants/colors'
import { GlobalStyles } from 'constants/GlobalStyles'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from 'slices/authenticationSlice'
import auth from '@react-native-firebase/auth';
import { removeDeviceToken } from '../../notification/notification'

const ProfileScreen = ({navigation}) => {
  const restaurantId = useSelector(state => state.authentication.restaurantId)
  const dispatch = useDispatch()

  const handleSettings = () => {
    navigation.navigate('SettingsScreen')
  };

  const handleCallCustomerCarePress = () => {

  };

  const handleLogout =  () => {
    Alert.alert('Logout', 'Are you sure you wamt to logout', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: async () => {
        try{
          await auth().signOut()
          removeDeviceToken(restaurantId)
          console.log('logged out')
          dispatch(logout())
        } catch(e) {
          Alert.alert('Failed to logout')
        }
      }},
    ]);
  };

  return (
    <Layout
      showMenu
      navigation={navigation}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('images/logo-black.png')} style={styles.logo} />
        <Image source={{ uri: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" }} style={styles.userImage} />
        <Text style={styles.userName}>Raghav Handa</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.topButton]} onPress={handleSettings}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCallCustomerCarePress}>
            <Text style={styles.buttonText}>Call customer care</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[GlobalStyles.lightBorder,{ alignSelf: 'stretch', paddingLeft: 15 }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    maxWidth: 200,
    maxHeight: 80,
    resizeMode: 'contain',
  },
  userImage: {
    width: 133,
    height: 133,
    borderRadius: 100,
    marginVertical: 20,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  buttonGroup: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  button: {
    padding: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  topButton: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme,
  },
})