import { ScrollView, StyleSheet, Text, View, Switch, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import Layout from 'common/Layout';
import ScheduleToggle from './ScheduleToggle';
import colors from 'constants/colors';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import SelecetDateModal from './SelectDateModal';
import { toggleLoading } from '../../../redux/slices/uiSlice';
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';


const ManageScheduleScreen = ({ navigation }) => {
  const restaurantId = useSelector(state => state.authentication.restaurantId);
  const isLoading = useSelector(state => state.ui.loading);
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false);
  const [weekly, setWeekly] = useState(true);
  const [occasions, setOccasions] = useState([])
  const [availability, setAvailability] = useState({
    isOpen: null,
    from: '',
    until: ''
  });
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  useEffect(() => {
    try {
      dispatch(toggleLoading())
      firestore()
        .collection('restaurants')
        .doc(restaurantId)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            const general = documentSnapshot.data().availability.general;
            setAvailability(general);
            const occasions = documentSnapshot.data().availability.occasional;
            setOccasions(occasions)
          }
        });
    } catch (e) {
      console.log('error getting data', e.message);
    } finally {
      dispatch(toggleLoading())
    }
  }, []);
  console.log('occasions', occasions)
  const updateAvailability = (day, isOpen, from, until) => {
    try {
      dispatch(toggleLoading())
      const newAvailability = { ...availability, [day]: { isOpen, from, until } };
      firestore()
        .collection('restaurants')
        .doc(restaurantId)
        .update({
          'availability.general': newAvailability
        })
        .then(() => {
          setAvailability(newAvailability);
        });
    } catch (e) {
      console.log('error updating data', e.message);
    } finally {
      dispatch(toggleLoading())
    }
  };

  const handleTimeChange = (day, newTime, type) => {
    const timeStr = newTime.getHours().toString().padStart(2, '0') + ':' + newTime.getMinutes().toString().padStart(2, '0');
    if (type === 'from') {
      updateAvailability(day, availability[day]?.isOpen, timeStr, availability[day]?.until);
    } else {
      updateAvailability(day, availability[day]?.isOpen, availability[day]?.from, timeStr);
    }
  };

  const DaySchedule = ({ day }) => {
    const [isEnabled, setIsEnabled] = useState(availability[day]?.isOpen);
    const [from, setFrom] = useState(new Date(2021, 0, 1, parseInt(availability[day]?.from?.split(':')[0]), parseInt(availability[day]?.from?.split(':')[1])));
    const [until, setUntil] = useState(new Date(2021, 0, 1, parseInt(availability[day]?.until?.split(':')[0]), parseInt(availability[day]?.until?.split(':')[1])));
    const [showPicker, setShowPicker] = useState(false);
    const [activePicker, setActivePicker] = useState('from');

    const toggleSwitch = () => {
      const newIsOpen = !isEnabled;
      setIsEnabled(newIsOpen);
      updateAvailability(day, newIsOpen, availability[day]?.from, availability[day]?.until);
    };

    return (
      <View style={styles.scheduleContainer}>
        <View style={styles.topSection}>
          <View>
            <Text style={styles.every}>Every</Text>
            <Text style={styles.day}>{day}</Text>
          </View>
          <View style={styles.row}>
            <Switch
              trackColor={{ false: '#F0F0F0', true: colors.theme }}
              thumbColor={isEnabled ? colors.lightGray : '#A6A6A6'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text style={isEnabled ? styles.label : styles.closed}>{isEnabled ? 'Open' : 'Closed'}</Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.availabilityRow}>
            <View>
              <Text style={[styles.availabilityLabel, !isEnabled && styles.disabledText]}>From</Text>
              <TouchableOpacity
                disabled={!isEnabled}
                onPress={() => { setShowPicker(true); setActivePicker('from'); }}
                style={styles.availabilityInput}
              >
                <Text style={[styles.availabilityText, !isEnabled && styles.disabledText]}>{from.getHours().toString().padStart(2, '0') + ':' + from.getMinutes().toString().padStart(2, '0')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.distanceBar}>
              <View style={styles.dot}></View>
              <View style={styles.dashedLine}></View>
              <View style={styles.dot}></View>
            </View>
            <View>
              <Text style={[styles.availabilityLabel, !isEnabled && styles.disabledText]}>Until</Text>
              <TouchableOpacity
                disabled={!isEnabled}
                onPress={() => { setShowPicker(true); setActivePicker('until'); }}
                style={styles.availabilityInput}
              >
                <Text style={[styles.availabilityText, !isEnabled && styles.disabledText]}>{until.getHours().toString().padStart(2, '0') + ':' + until.getMinutes().toString().padStart(2, '0')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {showPicker && (
          <DateTimePickerModal
            mode="time"
            is24Hour={true}
            display="spinner"
            value={activePicker === 'from' ? from : until}
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) {
                if (activePicker === 'from') {
                  setFrom(selectedDate);
                  handleTimeChange(day, selectedDate, 'from');
                } else {
                  setUntil(selectedDate);
                  handleTimeChange(day, selectedDate, 'until');
                }
              }
            }}
            minuteInterval={15}
          />
        )}
      </View>
    );
  };

  const Occasions = () => {
    const [pickingForIndex, setPickingForIndex] = useState(null);
    const [activePicker, setActivePicker] = useState('from');
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const handleDateChange = (newDate) => {
      console.log("Updating date in parent:", newDate);
      setDate(newDate);
    };
  
   
  
    const handleDateTimePickerChange = (event, selectedDate) => {
      setShowPicker(false);
      if (selectedDate && pickingForIndex !== null) {
        handleOccasionTimeChange(pickingForIndex, selectedDate, activePicker);
      }
    };
  
    const handleOccasionTimeChange = (index, newTime, type) => {
      const updatedOccasions = [...occasions];
      const timeStr = newTime.getHours().toString().padStart(2, '0') + ':' + newTime.getMinutes().toString().padStart(2, '0');
      updatedOccasions[index][type] = timeStr;
      setOccasions(updatedOccasions);
      // Update Firestore
      firestore()
        .collection('restaurants')
        .doc(restaurantId)
        .update({ 'availability.occasional': updatedOccasions });
    };
    const handleAddOccasion = () => {
      const newOccasion = {
        date: firestore.Timestamp.fromDate(date), // Convert JavaScript Date to Firestore Timestamp
        isOpen: false, // isOpen set to false as required
        from: '09:00', // Default start time
        until: '23:00' // Default end time
      };
    
      const updatedOccasions = [...occasions, newOccasion];
      setOccasions(updatedOccasions); // Update local state
    
      firestore()
        .collection('restaurants')
        .doc(restaurantId)
        .update({
          'availability.occasional': updatedOccasions
        })
        .then(() => {
          console.log("Occasion added successfully.");
        })
        .catch(error => {
          console.error("Error adding occasion: ", error);
        });
    };

    return (
      <>
      <ScrollView style={{ marginBottom: 120 }}>
        {occasions.map((occasion, index) => (
          <View key={index} style={styles.scheduleContainer}>
            <View style={styles.topSection}>
            <Text style={styles.day}>{occasion.date.toDate().toLocaleDateString()}</Text>
            <View style={styles.row}>
            <Switch
              trackColor={{ false: '#F0F0F0', true: colors.theme }}
              thumbColor={occasion.isOpen ? colors.lightGray : '#A6A6A6'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(newIsOpen) => {
                const updatedOccasions = [...occasions];
                updatedOccasions[index].isOpen = newIsOpen;
                setOccasions(updatedOccasions);
                // Update Firestore
                firestore()
                  .collection('restaurants')
                  .doc(restaurantId)
                  .update({ 'availability.occasional': updatedOccasions });
              }}
              value={occasion.isOpen}
            />
            <Text style={occasion.isOpen ? styles.label : styles.closed}>{occasion.isOpen ? 'Open' : 'Closed'}</Text>
            </View>
            </View>
            <View style={styles.bottomSection}>
            <View style={styles.availabilityRow}>
              <View>
              <Text style={[styles.availabilityLabel, !occasion.isOpen && styles.disabledText ]}>From</Text>
            <TouchableOpacity
              disabled={!occasion.isOpen}
             style={styles.availabilityInput} 
             onPress={() => { setShowPicker(true); setActivePicker('from'); setPickingForIndex(index); }}>
              <Text style={[styles.availabilityText, !occasion.isOpen && styles.disabledText]}>{occasion.from}</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.distanceBar}>
              <View style={styles.dot}></View>
              <View style={styles.dashedLine}></View>
              <View style={styles.dot}></View>
            </View>
            <View>
            <Text style={[styles.availabilityLabel, !occasion.isOpen && styles.disabledText]}>Until</Text>
            <TouchableOpacity style={styles.availabilityInput} onPress={() => { setShowPicker(true); setActivePicker('until'); setPickingForIndex(index); }}>
              <Text style={[styles.availabilityText, !occasion.isOpen && styles.disabledText]}>{occasion.until}</Text>
            </TouchableOpacity>
            </View>
            </View>
            </View>
          </View>
        ))}
        {showPicker && (
          <DateTimePickerModal
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={handleDateTimePickerChange}
            minuteInterval={15}
            value={new Date(2021, 0, 1, parseInt(occasions[pickingForIndex]?.[activePicker]?.split(':')[0]), parseInt(occasions[pickingForIndex]?.[activePicker]?.split(':')[1]))}
          />
        )}
      </ScrollView>
      <SelecetDateModal 
      visible={modalVisible} 
      onClose={toggleModal}
      date={date}
      onAdd={handleAddOccasion}
      onDateChange={handleDateChange}
    /></>
    );
  };  
  

  return (
    <Layout
      title='Manage Schedule'
      navigation={navigation}
      headerRightIcon
    >
      <View>
        <ScheduleToggle
          style={styles.toggle}
          onPress1={() => setWeekly(true)}
          onPress2={() => setWeekly(false)}
        />
        {weekly ?
          <ScrollView style={{ marginBottom: 120 }}>
            {isLoading && <ActivityIndicator size="large" color={colors.theme} />}
            {Object.keys(availability)
              .sort((a, b) => ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(a.toLowerCase()) - ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(b.toLowerCase()))
              .map(day => (
                <DaySchedule key={day} day={day} />
              ))}
          </ScrollView>
          :
          // <>
          //   <ScrollView>
          //    <Occasions />
          //   </ScrollView>
          // </>
          <Occasions />
        }
      </View>
      {(!weekly && !modalVisible) &&
      <TouchableOpacity onPress={toggleModal} style={styles.addContainer}>
        <Image style={styles.plusIcon} source={require('images/plus.png')} />
      </TouchableOpacity>
      }
    </Layout>
  );
};

export default ManageScheduleScreen;

const styles = StyleSheet.create({
  toggle: {
    marginTop: 20,
    marginBottom: 10,
  },
  scheduleContainer: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    // paddingVertical: 12,
  },
  topSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSection: {

  },
  every: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 2,
  },
  day: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'capitalize'
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.theme,
  },
  closed: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkGray,
  },
  // bottom section
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  availabilityInput: {
    borderWidth: 3,
    borderColor: 'rgba(171, 171, 171, .3)',
    borderRadius: 6,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  availabilityText: {
    color: colors.theme,
    fontSize: 20,
    fontWeight: 'bold',
  },
  availabilityLabel: {
    color: colors.theme,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 4,
  },
  disabledText: {
    color: 'rgba(171, 171, 171, .3)',
  },
  distanceBar: {
    width: 100,
    flexDirection: 'row',
    height: 1,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
  },
  dot: {
    backgroundColor: colors.theme,
    width: 10,
    height: 10,
    borderRadius: 100,
  },
  dashedLine: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#52A5E4',
    borderStyle: 'dashed',
  },
  addContainer: {
    backgroundColor: colors.theme,
    borderRadius: 100,
    padding: 16,
    position: 'absolute', 
    zIndex: 2,
    bottom: 20,
    right: 20,
  },
  plusIcon: {
    width: 25,
    height: 25,
  }
})