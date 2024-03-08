import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import Layout from 'common/Layout'
import { GlobalStyles } from 'constants/GlobalStyles'
import colors from 'constants/colors'


const DATA = [
  { id: '1', orderNumber: '#13453', time: '13:12', amount: '₹13000' },
  { id: '2', orderNumber: '#13454', time: '15:08', amount: '₹17000' },
  { id: '3', orderNumber: '#13455', time: '18:34', amount: '₹1500' },
];

const Item = ({ orderNumber, time, amount }) => (
  <View style={styles.item}>
    <View style={styles.leftColumn}>
      <Text style={styles.orderNumber}>{orderNumber}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
    <Text style={styles.amount}>{amount}</Text>
  </View>
);

const Separator = () => <View style={styles.separator} />;

const BusinessScreen = ({ navigation}) => {
  const [activePeriod, setActivePeriod] = useState('Day');

  return (
    <Layout
      navigation={navigation}
    >
      <View style={[GlobalStyles.lightBorder, styles.topSection]}>
        <View>
          <Text style={styles.totalAmount}>₹42000</Text>
          <Text style={styles.received}>
            {activePeriod === 'Day' ? 'Received today' :
              activePeriod === 'Week' ? 'Received this week' :
                'Received this month'}
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activePeriod === 'Day' ? styles.active : null]}
            onPress={() => setActivePeriod('Day')}
          >
            <Text style={[styles.toggleText, activePeriod === 'Day' ? styles.active : null]}>Day</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activePeriod === 'Week' ? styles.active : null]}
            onPress={() => setActivePeriod('Week')}
          >
            <Text style={[styles.toggleText, activePeriod === 'Week' ? styles.active : null]}>Week</Text>
          </TouchableOpacity>
    
            <TouchableOpacity
              style={[styles.toggleButton, activePeriod === 'Month' ? styles.active : null]}
              onPress={() => setActivePeriod('Month')}
            >
              <Text style={[styles.toggleText, activePeriod === 'Month' ? styles.active : null]}>Month</Text>
            </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 20}}>
        <Text style={styles.received}>Summary</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={DATA}
          renderItem={({ item }) => <Item orderNumber={item.orderNumber} time={`Received at ${item.time}`} amount={item.amount} />}
          keyExtractor={item => item.id}
          ListHeaderComponent={<Text style={styles.header}>Today</Text>}
          ItemSeparatorComponent={Separator}
        />
      </View>
    </Layout>
  )
}

export default BusinessScreen

const styles = StyleSheet.create({
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  totalAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'black',
    marginBottom: 4,
  },
  received: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.theme
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray, // Non-active background color
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 18, // Slightly less than container to fit inside padding
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Default non-active color
  },
  active: {
    backgroundColor: colors.theme, // Active background color
    color: 'white',
  },
  toggleText: {
    color: colors.theme, // Text color
    fontSize: 12,
    fontWeight: '600'
  },

  // List
  listContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    fontWeight: '600',
    fontSize: 12,
    padding: 10,
    backgroundColor: colors.lightGray,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black'
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.theme,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.theme,
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGray, // Light grey color for the separator
    width: '100%',
  },
})