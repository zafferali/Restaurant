import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SearchBar from 'common/SearchBar'
import Layout from 'common/Layout'
import StatusToggle from 'components/order/StatusToggle'
import colors from 'constants/colors'
import ColouredButton from 'common/ColouredButton'
import ItemWithQty from 'components/order/ItemWithQty'

const OrderDetailScreen = ({ route, navigation }) => {

  return (
    <Layout  
     showBackButton
     smallTitle={route.params.orderNum}
     onBackPress={() => navigation.goBack()}
    >
      <SearchBar
        placeholder="Search orders.."
        onSearch={(query) => {
          console.log(query)
        }}
      />

        <View style={styles.statusContainer}>
            <View>
                <Text >Update Status</Text>
            </View>
            <StatusToggle style={styles.toggle}/>
        </View>

        {/* <View style={styles.itemContainer}>
            <ItemWithQty style={styles.item} itemName={"Pizza"} itemQty={"2"}/>
            <ItemWithQty style={styles.item} itemName={"Brownie"} itemQty={"1"}/>
        </View> */}

        <View style={styles.bottomSection}>
           <ColouredButton
            bgColor= '#FFF1CC'
            textColor= '#BA8700'
            title= 'Call Helpdesk'
            icon
            onPress= {() => console.log('pressed')}
           />

           <ColouredButton
            bgColor= {colors.warning}
            textColor= {colors.danger}
            title= 'Cancel Order'
            onPress= {() => console.log('pressed')}
           />
        </View>
    </Layout>
  )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        gap: 10,
      },
    toggle: {
        flex: 2,
    },

    itemContainer: {

    },
    bottomSection: {
        position: 'absolute',
        bottom: 10,
    }
})