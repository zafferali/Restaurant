import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth'

// Function to register the device token
export const registerDeviceToken = async () => {
  const token = await messaging().getToken()
  const user = auth().currentUser

  if (user) {
    const userRef = firestore().collection('users').doc(user.uid)
    userRef.update({
      fcmToken: token
    })
  }
}

// Function to remove the device token
export const removeDeviceToken = async () => {
  const user = auth().currentUser

  if (user) {
    const userRef = firestore().collection('users').doc(user.uid)

    // Clear the token from the fcmToken field
    userRef.update({
      fcmToken: firestore.FieldValue.delete()
    })
  }
}
