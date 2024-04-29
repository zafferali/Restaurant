import React, { useState } from 'react'
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native'

const InputModal = ({ visible, onCancel, onSubmit, inputs }) => {
  const [inputValues, setInputValues] = useState({})

  const handleInputChange = (key, value) => {
    setInputValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = () => {
    onSubmit(inputValues)
    onCancel()  // Optionally reset inputs here or handle outside
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {inputs.map(input => (
            <TextInput
              key={input.key}
              placeholder={input.placeholder}
              secureTextEntry={input.secure || false}
              style={styles.input}
              onChangeText={text => handleInputChange(input.key, text)}
              value={inputValues[input.key] || ''}
            />
          ))}
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Cancel" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    width: 200,
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5
  }
})

export default InputModal
