import React, { useRef } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import colors from 'constants/colors'

const SearchBar = ({ placeholder, onSearch }) => {
  const inputRef = useRef(null)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => inputRef.current.focus()}
        style={styles.iconContainer}
      >
        <Image
          source={require('images/search.png')} // Replace with your search icon
          style={styles.icon}
        />
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        onChangeText={onSearch}
        placeholder={placeholder}
        placeholderTextColor='#666666'
        style={styles.input}
        clearButtonMode="while-editing" // iOS only
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    borderColor: colors.border,
    borderWidth: 1,
    marginTop: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    width: 18,
    height: 18,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
})

export default SearchBar
