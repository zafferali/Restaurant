import { StyleSheet, Text, View, TouchableOpacity, FlatList, Switch, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import Layout from 'common/Layout';
import { GlobalStyles } from 'constants/GlobalStyles';
import colors from 'constants/colors';
import CustomButton from 'common/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import { toggleLoading } from '../../redux/slices/uiSlice';

const Availability = ({restaurantId, navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const fetchRestaurantAvailability = () => {
      const now = moment.tz('Asia/Kolkata'); // Current time in IST
      const todayDate = moment.tz(new Date(), 'Asia/Kolkata').startOf('day'); // Start of the day in IST      
      console.log("Now in IST:", now.format('YYYY-MM-DD HH:mm:ss Z'));
      console.log("Today's Date in IST:", todayDate.format('YYYY-MM-DD HH:mm:ss Z'));

  
      const docRef = firestore().collection('restaurants').doc(restaurantId);
      const unsubscribe = docRef.onSnapshot((snapshot) => {
        const restaurantData = snapshot.data();
  
        // Check general availability first
        const dayOfWeek = now.format('dddd').toLowerCase();
        const currentDay = restaurantData.availability.general ? restaurantData.availability.general[dayOfWeek] : null;
        if (currentDay && currentDay.isOpen) {
          const from = moment.tz(`${todayDate.format('YYYY-MM-DD')}T${currentDay.from}`, 'Asia/Kolkata');
          const until = moment.tz(`${todayDate.format('YYYY-MM-DD')}T${currentDay.until}`, 'Asia/Kolkata');
          setIsEnabled(now.isBetween(from, until, null, '[]'));
        } else {
          setIsEnabled(false);
        }
  
        // Override with occasional availability if there's a match
        const occasions = restaurantData.availability.occasional;
        if (occasions && occasions.length > 0) {
          occasions.forEach(occasion => {
            const occasionDate = moment(occasion.date.toDate()).tz('Asia/Kolkata').startOf('day');
            if (todayDate.isSame(occasionDate, 'day')) {
              console.log('inse', todayDate)
              const fromTime = moment.tz(`${todayDate.format('YYYY-MM-DD')}T${occasion.from}`, 'Asia/Kolkata');
              const untilTime = moment.tz(`${todayDate.format('YYYY-MM-DD')}T${occasion.until}`, 'Asia/Kolkata');
              setIsEnabled(occasion.isOpen && now.isBetween(fromTime, untilTime, null, '[]'));
            }
          });
        }
      });
  
      return () => unsubscribe();
    };
  
    const unsubscribe = fetchRestaurantAvailability();
    return () => {
      unsubscribe();
    };
  }, [restaurantId]);
  const toggleSwitch = () => {
    // Toggle switch logic if needed
  };

  return (
    <View style={[GlobalStyles.lightBorder, { paddingVertical: 20 }]}>
      <View style={styles.topSection}>
        <Text style={[styles.received, { fontSize: 16, color: isEnabled ? colors.theme : colors.danger }]}>
          {isEnabled ? 'Restaurant Open' : 'Restaurant Closed'}
        </Text>
        <Switch
          trackColor={{ false: colors.warning, true: colors.theme }}
          thumbColor={isEnabled ? colors.lightGray : colors.danger}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <CustomButton title='Manage Schedule' onPress={() => navigation.navigate('ManageScheduleScreen')} style={{ marginTop: 30 }} />
    </View>
  );
};

const getStartOfDay = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
};

const getStartOfWeek = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  start.setDate(diff);
  return start;
};


const getStartOfMonth = () => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
};

const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatDateAndTime = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const formattedTime = formatTime(date);
  return `${day} ${month} ${formattedTime}`;
};


const Item = ({ orderNum, time, amount }) => (
  <View style={styles.item}>
    <View style={styles.leftColumn}>
      <Text style={styles.orderNum}>#{orderNum}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
    <Text style={styles.amount}>{amount}</Text>
  </View>
);

const Separator = () => <View style={styles.separator} />;

const BusinessScreen = ({ navigation }) => {
  const restaurantId = useSelector(state => state.authentication.restaurantId);
  const isLoading = useSelector(state => state.ui.loading)
  const dispatch = useDispatch();
  const [activePeriod, setActivePeriod] = useState('Day');
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState('₹0');

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(toggleLoading())

      try {
        let startOfPeriod;
        let endOfPeriod;
        if (activePeriod === 'Day') {
          startOfPeriod = firestore.Timestamp.fromDate(getStartOfDay());
          endOfPeriod = firestore.Timestamp.fromDate(new Date(getStartOfDay().getTime() + 86400000)); // +1 day in ms
        } else if (activePeriod === 'Week') {
          startOfPeriod = firestore.Timestamp.fromDate(getStartOfWeek());
          endOfPeriod = firestore.Timestamp.fromDate(new Date(getStartOfWeek().getTime() + 604800000)); // +7 days in ms
        } else if (activePeriod === 'Month') {
          startOfPeriod = firestore.Timestamp.fromDate(getStartOfMonth());
          const nextMonth = new Date(getStartOfMonth());
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          endOfPeriod = firestore.Timestamp.fromDate(nextMonth);
        }

        let query = firestore().collection('orders')
          .where('restaurant', '==', firestore().doc(`restaurants/${restaurantId}`))
          .where('timeStamps.orderPicked', '>=', startOfPeriod);

        if (endOfPeriod) {
          query = query.where('timeStamps.orderPicked', '<', endOfPeriod);
        }

        const snapshot = await query.get();

        const fetchedOrders = [];
        let newTotal = 0;

        snapshot.forEach(doc => {
          const data = doc.data();
          const orderTime = data.timeStamps.orderPicked.toDate();
          let timeString;

          if (activePeriod === 'Day') {
            timeString = `${formatTime(orderTime)}`;
          } else {
            timeString = formatDateAndTime(orderTime);
          }

          fetchedOrders.push({
            id: doc.id,
            orderNum: data.orderNum,
            time: timeString,
            amount: `₹${data.totalPrice}`
          });
          newTotal += Number(data.totalPrice);
        });

        setOrders(fetchedOrders);
        setTotalAmount(`₹${newTotal.toLocaleString()}`);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        dispatch(toggleLoading())
      }
    };

    fetchOrders();
  }, [activePeriod, restaurantId]);

  return (
    <Layout
      navigation={navigation}
      title='Business'
    >
      <Availability restaurantId={restaurantId} navigation={navigation}/>
      <View style={[GlobalStyles.lightBorder, styles.topSection]}>
        <View>
          <Text style={styles.totalAmount}>{totalAmount}</Text>
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
      {isLoading? <ActivityIndicator size="large" color={colors.theme} />:
      <View style={styles.listContainer}>
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <Item
              orderNum={item.orderNum}
              time={`${activePeriod === 'Day' ? 'Received at' : 'Received on'} ${item.time}`}
              amount={item.amount}
            />
          )}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <Text style={styles.header}>
              {activePeriod === 'Day' ? 'Today' :
              activePeriod === 'Week' ? 'This Week' :
              'This Month'}
            </Text>
          }
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={() => (
            <View style={styles.item}>
              <Text>No orders</Text>
            </View>
          )}
        />
      </View>}
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
    fontSize: 14,
    color: colors.theme
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 18, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', 
  },
  active: {
    backgroundColor: colors.theme,
    color: 'white',
  },
  toggleText: {
    color: colors.theme,
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
  orderNum: {
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