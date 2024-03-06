import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MenuItem = () => {
  return (
    <TouchableOpacity onPress={navigateToHome} style={styles.menuItem}>
        <Image source={require('images/home-icon.png')} style={styles.menuIcon}/>
        <Text style={styles.menuText}>Home</Text>
    </TouchableOpacity>
  )
}

export default MenuItem

const styles = StyleSheet.create({})