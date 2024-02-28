import React, { useState } from 'react';
import { View, Image, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from 'common/CustomInput';
import CustomButton from 'common/CustomButton';

const LoginScreen = () => {
  const [vendorCode, setVendorCode] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle the login logic here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={require('path-to-your-background-image')} // Replace with your actual background image path
        style={styles.backgroundImage}
      >
        <View style={styles.topContainer}>
          <Image
            source={require('path-to-your-logo-image')} // Replace with your actual logo image path
            style={styles.logo}
          />
        </View>
        <View style={styles.bottomContainer}>
          <CustomInput
            placeholder="Vendor code"
            value={vendorCode}
            onChangeText={setVendorCode}
          />
          <CustomInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <CustomButton
            title="Login"
            onPress={handleLogin}
          />
          {/* Include other components like Terms and Policy */}
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
    justifyContent: 'flex-end', // This will align the half-sphere overlay to the bottom
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '60%', // Adjust the width as per your logo's aspect ratio
    height: '30%', // Adjust the height as per your logo's aspect ratio
    resizeMode: 'contain',
  },
  bottomContainer: {
    backgroundColor: 'rgba(211, 211, 211, 0.5)', // Light gray color with opacity
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30, // Adjust the border radius to match your design for the half-sphere
    borderTopRightRadius: 30, // Adjust the border radius to match your design for the half-sphere
    alignItems: 'stretch', // Ensures inputs and button stretch to the full width
  },
  // ... styles for your inputs and button (re-use the styles from earlier)
});

export default LoginScreen;
