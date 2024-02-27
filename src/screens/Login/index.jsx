import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import PrimaryLayout from 'layouts/PrimaryLayout';

const LoginScreen = () => {
  const [vendorCode, setVendorCode] = useState('');
  const [password, setPassword] = useState('');

  // Placeholder function for login action
  const handleLogin = () => {
    // Implement login logic here
    console.log('Login pressed with:', vendorCode, password);
  };

  return (
    <PrimaryLayout>
      <ImageBackground
        source={require('assets/images/main.png')}
        style={styles.backgroundImage}>
        <View style={styles.overlay}>
          {/* Replace 'path-to-your-logo-image' with your actual image path */}
          <Text style={styles.logoPlaceholder}>LOGO IMAGE</Text>
          <Text style={styles.title}>BriskIT</Text>
          <Text style={styles.subtitle}>Partner companion</Text>
          <TextInput
            value={vendorCode}
            onChangeText={setVendorCode}
            placeholder="Vendor code"
            placeholderTextColor="#ddd"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#ddd"
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            By signing up, you agree to the{' '}
            <Text style={styles.linkText}>Terms & Policy & Privacy Policy</Text>
          </Text>
        </View>
      </ImageBackground>
    </PrimaryLayout>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // This gives us the tint
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logoPlaceholder: {
    alignSelf: 'center',
    marginBottom: 20,
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  termsText: {
    color: 'white',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
