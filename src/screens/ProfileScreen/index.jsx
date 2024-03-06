import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Layout from 'common/Layout'

const ProfileScreen = ({ navigation}) => {
  return (
    <Layout  
    showMenu
    bigTitle="Profile"
    navigation={navigation}
   >
      <Text>ProfileScreen</Text>
    </Layout>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})