import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Layout from 'common/Layout'

const MenuScreen = ({ navigation }) => {

  return (
    <Layout
      title='Menu'
      navigation={navigation}
    >
      <View>
        <Text>Hello</Text>
      </View>
    </Layout>
  )
}

export default MenuScreen


const styles = StyleSheet.create({})