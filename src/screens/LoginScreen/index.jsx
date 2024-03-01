import React, { useState } from 'react';
import { Dimensions, View, Image, Text, TextInput, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import colors from 'constants/colors';
import { BlurView } from '@react-native-community/blur';

const { width, height } = Dimensions.get('window');
const sphereSize = width * 2;

const LoginScreen = ({ navigation }) => {
  const [vendorCode, setVendorCode] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('OrderListScreen')
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          <Text style={styles.subtitle}>Partner companion</Text>
        </View>

        {/* Semi-transparent overlay View */}

        <View style={styles.halfSphere}/>
        <Image
          source={require('images/ellipse.png')}
          style={styles.blurredOverlay}
        />
          <View style={styles.form}>
            <TextInput
              placeholder="Vendor code"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={vendorCode}
              onChangeText={setVendorCode}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>  By signing up, you agree to the</Text>   
            <Text style={styles.linkText}>Terms & Policy & Privacy Policy</Text>    
          </View>
        {/* </View> */}
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
    color: '#C2C2C2',
    alignSelf: 'center',
    marginBottom: 40,
  },
  halfSphere: {
    position: 'absolute',
    width: sphereSize,
    height: sphereSize,
    borderRadius: sphereSize / 2,
    backgroundColor: 'rgba(46, 94, 130, 0.8)',
    bottom: -width * 0.65, 
    left: -width * 0.5,
  },
  blurredOverlay: {
    position: 'absolute',
    width: sphereSize,
    height: sphereSize, 
    borderRadius: sphereSize / 2,
    bottom: -width * 0.85,
    left: -width * 0.5,
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
    borderRadius: 8,
    height: 54,
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  button: {
    
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
