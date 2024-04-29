import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export const registerDeviceToken = async (restaurantId) => {
  const token = await messaging().getToken();
  // Assuming restaurantId is the document ID for the restaurant in the Firestore
  const restaurantRef = firestore().collection('restaurants').doc(restaurantId);

  // Add the token to the fcmTokens array without duplicates
  restaurantRef.update({
    fcmTokens: firestore.FieldValue.arrayUnion(token)
  });
}

export const removeDeviceToken = async (restaurantId) =>  {
    const token = await messaging().getToken();
    const restaurantRef = firestore().collection('restaurants').doc(restaurantId);
  
    // Remove the token from the fcmTokens array
    restaurantRef.update({
      fcmTokens: firestore.FieldValue.arrayRemove(token)
    });
  }
  


