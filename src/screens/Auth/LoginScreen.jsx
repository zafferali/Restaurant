import { useState } from 'react'
import { View, Image, Text, TextInput, ImageBackground, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { login } from '../../redux/slices/authenticationSlice'
import { useSelector, useDispatch } from 'react-redux'
import { toggleLoading } from '../../redux/slices/uiSlice'
import colors from 'constants/colors'
import { updateUser } from 'slices/userSlice'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.ui.loading)
  const [focus, setFocus] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter all fields')
      return
    }
    dispatch(toggleLoading())
    try {
      let response = await auth().signInWithEmailAndPassword(email, password);
      if (response && response.user) {
        const userDoc = await firestore().collection('users').doc(response.user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const role = userData.role;
          let restaurantId = null;
          const numRestaurants = userData.restaurants.length;
          if (userData.restaurants && numRestaurants > 0) {
            restaurantId = userData.restaurants[0].id;  
          }
          dispatch(login({
            userId: response.user.uid,
            restaurantId,
            role,
            numRestaurants
          }));
          dispatch(updateUser({
            name: userData.name,
            email: userData.email,
            mobile: userData.phone,
            photoUrl: userData.photoUrl,
          }))
        }
      }

    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No user found for this email')
      } else if (e.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Wrong password provided')
      } else {
        Alert.alert('Error', e.message)
      }
    } finally {
      dispatch(toggleLoading())
    }
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
    >
      <ImageBackground
        source={require('images/main.png')}
        style={styles.backgroundImage}
      >
        <View style={[styles.topSection]}>
          <Image
            source={require('images/logo.png')}
            style={[styles.logo, focus && {marginTop: 40}]}
          />
          <Text style={styles.subtitle}>Partner Companion</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            secureTextEntry
            value={password}
            onSubmitEditing={handleLogin}
            returnKeyType="go"
            onChangeText={setPassword}
            style={styles.input}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>By signing up, you agree to the</Text>
          <Text style={styles.linkText}>Terms & Policy & Privacy Policy</Text>
        </View>
        {isLoading ? (
          <View style={styles.overlayStyle}>
            <ActivityIndicator size='large' color={colors.theme} />
          </View>) : null}
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C2C2C2',
    alignSelf: 'center',
    marginBottom: 16,
  },
  form: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logo: {
    maxWidth: 234,
    maxHeight: 80,
    resizeMode: 'contain',
    marginTop: 180,
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#00000060',
    color: 'white',
    borderRadius: 8,
    height: 54,
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'black',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    color: 'rgba(211, 211, 211, 0.7)',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  overlayStyle: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

