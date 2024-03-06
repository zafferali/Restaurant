import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Layout from 'common/Layout'

const BusinessScreen = ({ navigation}) => {
  return (
    <Layout  
     showMenu
     bigTitle="Business"
     navigation={navigation}
    >
      <Text>BusinessScreen</Text>
    </Layout>
  )
}

export default BusinessScreen

const styles = StyleSheet.create({})