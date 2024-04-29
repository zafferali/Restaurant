import React, { useState } from 'react';
import { View, Image, Text, TextInput, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { login } from '../../redux/slices/authenticationSlice';
import { useDispatch } from 'react-redux';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }

    try {
      console.log('ep', email, password)
      let response = await auth().signInWithEmailAndPassword(email, password);
      if (response && response.user) {
        console.log('log', response.user.uid)
        dispatch(login(response.user.uid))
      }
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No user found for this email');
      } else if (e.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Wrong password provided');
      } else {
        Alert.alert('Error', e.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    style={styles.container}
    >
      <ImageBackground
        source={require('images/main.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.topSection}>
          <Image
            source={require('images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.subtitle}>Partner Companion</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
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
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>By signing up, you agree to the</Text>
          <Text style={styles.linkText}>Terms & Policy & Privacy Policy</Text>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

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
    paddingTop: 150,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C2C2C2',
    alignSelf: 'center',
    marginBottom: 40,
  },
  form: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logo: {
    maxWidth: 334,
    maxHeight: 106,
    resizeMode: 'contain',
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
  }
});

export default LoginScreen;
