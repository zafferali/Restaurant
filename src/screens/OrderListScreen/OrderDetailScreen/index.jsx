import { StyleSheet, Text, View, Image, ScrollView, Linking, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Layout from 'common/Layout'
import StatusToggle from 'components/order/StatusToggle'
import colors from 'constants/colors'
import ColouredButton from 'common/ColouredButton'
import ItemWithQty from 'components/order/ItemWithQty'
import { GlobalStyles } from 'constants/GlobalStyles'
import CustomCard from 'common/CustomCard'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { makeCall } from 'utils/makeCall'
import firestore from '@react-native-firebase/firestore'

const OrderDetailScreen = ({ route, navigation }) => {
  const orderId = route.params.orderId;
  const [order, setOrder] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [runner, setRunner] = useState(null) 

  useEffect(() => {
    const unsubscribeOrder = firestore().collection('orders').doc(orderId)
      .onSnapshot(doc => {
        if (doc.exists) {
          const orderData = doc.data();
          setOrder(orderData);

          if (orderData.customer) {
            orderData.customer.get().then(customerSnapshot => {
              if (customerSnapshot.exists) {
                setCustomer(customerSnapshot.data());
              } else {
                console.log('No customer data found!');
              }
            });
          }

          // Set up real-time listener for runner
          if (orderData.runner) {
            const runnerRef = orderData.runner;
            const unsubscribeRunner = runnerRef.onSnapshot(runnerSnapshot => {
              if (runnerSnapshot.exists) {
                setRunner(runnerSnapshot.data());
              } else {
                console.log('Runner data removed or not found');
                setRunner(null);  // Clear runner if reference is broken or deleted
              }
            }, error => {
              console.error("Error fetching runner data:", error);
            });

            return () => {
              unsubscribeRunner();  // Clean up the runner subscription when changing orders or component unmounts
            };
          } else {
            setRunner(null);  // Clear runner if no runner is assigned
          }
        } else {
          console.log('No such order document!');
        }
      }, error => {
        console.error("Error getting order document:", error);
      });

    return () => {
      unsubscribeOrder(); // Clean up the order subscription on component unmount
    };
  }, [orderId]);

  
  return (
    <>
      <Layout
        backTitle='Order'
        dynamicTitle={`#${order?.orderNum}`}
        navigation={navigation}
      >
        <ScrollView>
          <View style={styles.statusContainer}>
            <View>
              <Text style={styles.updateText}>Update Status</Text>
            </View>
            <StatusToggle  orderId={orderId} style={styles.toggle} />
          </View>

          <View style={[GlobalStyles.lightBorder, { marginTop: 15 }]}>
            {order?.items?.map(item=> <ItemWithQty key={item.id} style={styles.item} itemName={item.name} itemQty={item.quantity} />)}
          </View>

          {(customer?.name || order?.instructions) &&  
          <View style={[GlobalStyles.lightBorder, { marginTop: 15 }]}>
            {customer?.name && 
            <View style={styles.row}>
              <Text style={styles.text}>Customer Name</Text>
              {<Text style={styles.custName}>Raghav Handa</Text>}
            </View>}
            <View style={styles.row}>
              <Text style={styles.text}>Current Status</Text>
              <CustomCard text={order.orderStatus}/>
            </View>
            {order?.instructions && 
            <View style={styles.row}>
              <Text style={styles.text}>Extra Comments</Text>
               <CustomCard text={order.instructions} isLightText />
            </View>}
          </View>}

          {runner && 
          <View style={[GlobalStyles.lightBorder, { marginTop: 15 }]}>
            <View style={styles.row}>
              <Text style={styles.text}>Delivery Person</Text>
              <CustomCard text={runner.name} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Their Phone number</Text>
              <View style={styles.phoneNumCard}>
                <Text style={[styles.text, { color: colors.theme }]}>{runner.mobile}</Text>
                <TouchableOpacity onPress={() => makeCall("+919808701212")}>
                  <Image source={require('images/call-icon.png')} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>}

        </ScrollView>
      </Layout>
      <View style={styles.bottomSection}>
        <ColouredButton
          bgColor='#FFF1CC'
          textColor='#BA8700'
          title='Call Helpdesk'
          icon
          onPress={() => makeCall("+919884713387")}
        />

        {/* <ColouredButton
          bgColor={colors.warning}
          textColor={colors.danger}
          title='Cancel Order'
          onPress={() => console.log('pressed')}
        /> */}
      </View>
    </>
  )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    gap: 10,
  },
  updateText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'gray',
  },
  toggle: {
    flex: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  custName: {
    fontSize: 16,
    width: 160,
    fontWeight: '600',
    color: colors.theme,
    textAlign: 'left',
  },
  text: {
    color: colors.darkGray,
    fontWeight: '600',
    fontSize: 12,
  },
  phoneNumCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2E5E821A',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: 160,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 5,
    paddingHorizontal: 20,
  }
})