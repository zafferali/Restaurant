
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import Layout from 'common/Layout'
import SearchBar from 'common/SearchBar'
import { GlobalStyles } from 'constants/GlobalStyles'
import colors from 'constants/colors'

const MenuScreen = ({navigation}) => {
  const [menuItems, setMenuItems] = useState([])
  const restaurantId = useSelector(state => state.authentication.restaurantId)

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('restaurants')
      .doc(restaurantId)
      .collection('menu')
      .onSnapshot(
        snapshot => {
          const updatedMenuItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setMenuItems(updatedMenuItems)
        },
        error => {
          console.error("Error fetching menu items: ", error)
        }
      )
  
    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe()
  }, [restaurantId])
  

  const renderItem = ({ item }) => (
    <View style={[GlobalStyles.lightBorder, styles.itemContainer]}>
      <Image source={{uri: item.thumbnailUrl}} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditItemScreen', { itemId: item.id })}
      > 
        <Image source={require('images/edit.png')} style={styles.editIcon} />
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <Layout
      title='Menu'
      navigation={navigation}
    >
      <SearchBar
        placeholder="Search orders.."
        onSearch={(query) => {
          console.log(query)
        }}
      />
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    color: '#3B3B3B',
    marginBottom: 4,
  },
  description: {
    fontWeight: '600',
    fontSize: 12,
    color: '#717171',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.bgLight,
    borderRadius: 8,
    width: '20%',
  },
  editIcon: {
    width: 13,
    height: 13,
  },
  editText:{
    fontSize: 12,
    fontWeight: '600',
    color: colors.theme,
  },
})

export default MenuScreen

