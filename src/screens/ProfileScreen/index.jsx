import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Layout from 'common/Layout';
import colors from 'constants/colors';
import { GlobalStyles } from 'constants/GlobalStyles';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateRestaurant } from 'slices/authenticationSlice';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { removeDeviceToken } from '../../notification/notification';
import { makeCall } from 'utils/makeCall';
import { toggleLoading } from 'slices/uiSlice';

const ProfileScreen = ({ navigation }) => {
  const { userId, restaurantId, numRestaurants } = useSelector(state => state.authentication);
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const [restaurants, setRestaurants] = useState([]);
  const isLoading = useSelector(state => state.ui.loading)

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (numRestaurants > 1) {
        dispatch(toggleLoading())
        try {
          const userDoc = await firestore().collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
           
            console.log('user data', user)
            const restaurantRefs = userData.restaurants;
            const restaurantPromises = restaurantRefs.map(ref => ref.get());
            const restaurantDocs = await Promise.all(restaurantPromises);
            const fetchedRestaurants = restaurantDocs.map(doc => ({
              id: doc.id,
              branch: doc.data().branch
            }));
            setRestaurants(fetchedRestaurants);
          } else {
            throw new Error('User document does not exist');
          }
        } catch (error) {
          console.error('Failed to fetch restaurants:', error);
          setError(error.message);
          Alert.alert('Error', 'Failed to fetch restaurant daa');
        } finally {
          dispatch(toggleLoading())
        }
      }
    };
    fetchRestaurants();
  }, [userId, numRestaurants]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await auth().signOut();
            removeDeviceToken(restaurantId);
            console.log('logged out');
            dispatch(logout());
          } catch (e) {
            Alert.alert('Failed to logout');
          }
        },
      },
    ]);
  };

  return (
    <Layout showMenu navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('images/logo-black.png')} style={styles.logo} />
        <Image source={user.photoUrl? { uri: user.photoUrl }: require('images/user-thumbnail.png')} style={styles.userImage} />
        <Text style={styles.userName}>{user.name}</Text>
        {numRestaurants > 1 && (
          <View style={{alignSelf: 'stretch'}}>
            {isLoading? <ActivityIndicator size='large' color={colors.theme} /> :
            <>
              <Text style={styles.title}>Manage Branches</Text>
              <View style={styles.buttonGroup}>
                {restaurants.map((restaurant, index) => (
                <TouchableOpacity
                key={restaurant.id}
                style={[styles.branchButton, index > 0 ? styles.button : styles.topButton]}
                onPress={() => dispatch(updateRestaurant(restaurant.id))}
              >
                <View style={styles.branchContainer}>
                  <Text style={styles.buttonText}>{restaurant.branch}{restaurantId === restaurant.id && ' *'} </Text>
                  {restaurantId === restaurant.id && 
                  <View style={styles.managing}><Text style={styles.managingText}>Currently Managing</Text></View> }
                </View>
              </TouchableOpacity>
                ))}
              </View>
            </>}
          </View>
        )}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.topButton]} onPress={() => navigation.navigate('SettingsScreen')}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => makeCall()}>
            <Text style={styles.buttonText}>Call customer care</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[GlobalStyles.lightBorder, { alignSelf: 'stretch', paddingLeft: 15 }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'flex-start'
  },
  logo: {
    maxWidth: 200,
    maxHeight: 80,
    resizeMode: 'contain',
  },
  userImage: {
    width: 110,
    height: 110,
    borderRadius: 100,
    marginVertical: 10,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
  },
  title: {
    color: '#003862',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  selectedBranch: {
    backgroundColor: 'rgba(46, 94, 130, 0.1)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  branchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  managing: {
    backgroundColor: 'rgba(46, 94, 130, 0.3)',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  managingText: {
    color: '#5EA2D5',
    fontSize: 12,
    fontWeight: '600'
  },
  buttonGroup: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'stretch',
    marginBottom: 14,
  },
  button: {
    padding: 15,
    justifyContent: 'center',
  },
  branchButton: {
    padding: 15,
    alignSelf: 'stretch'
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