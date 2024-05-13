import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Layout from 'common/Layout';
import { GlobalStyles } from 'constants/GlobalStyles';
import colors from 'constants/colors';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import uploadImageToFirebase from 'utils/uploadImage';
import UploadImageModal from './UploadImageModal';
import ColouredButton from 'common/ColouredButton';
import { toggleLoading } from 'slices/uiSlice';
import DateTimePickerModal from '@react-native-community/datetimepicker';

const Input = ({ label, value, onChangeText, multiline, numeric, cm, textColor }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType={numeric && 'numbers-and-punctuation'}
        multiline={multiline}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, textColor && { color: colors.theme }]}
      />
      {cm &&
        <View style={styles.cm}>
          <Text style={{ color: 'gray', fontWeight: '600' }}>cm</Text>
        </View>
      }
    </View>
  );
};

const TimeInput = ({ label, value, onChangeTime }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = (date) => {
    setShowPicker(false);
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    onChangeTime(formattedTime);
  };

  return (
    <View style={styles.row}>
        <View>
          <Text style={styles.availabilityLabel}>{label}</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.availabilityInput}>
            <Text style={styles.availabilityText}>{value}</Text>
          </TouchableOpacity>
        </View>
      {showPicker && (
        <DateTimePickerModal
          mode="time"
          is24Hour={true}
          display="spinner"
          value={new Date(2021, 0, 1, value.split(':')[0], value.split(':')[1])}
          onChange={(event, selectedDate) => selectedDate && handleConfirm(selectedDate)}
          minuteInterval={15}
        />
      )}
    </View>
  );
};

const EditItemScreen = ({ navigation, route }) => {
  const restaurantId = useSelector(state => state.authentication.restaurantId);
  const itemId = route.params.itemId;
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const isLoading = useSelector(state => state.ui.loading);

  const [state, setState] = useState({
    thumbnailUrl: null,
    name: '',
    description: '',
    temperature: '',
    availability: {
      from: '09:00',
      until: '17:00'
    },
    size: {
      length: '',
      breadth: '',
      height: '',
    }
  });

  const handleUploadImage = async (fromCamera) => {
    try {
      dispatch(toggleLoading())
      const url = await uploadImageToFirebase(fromCamera)
      setImageUrl(url)
      setState(prevState => ({
        ...prevState,
        thumbnailUrl: url
      }));
      setModalVisible(false)
    } catch (error) {
      Alert.alert('The image was not uploaded. Please try again')
    } finally {
      dispatch(toggleLoading());// Stop loading after uploading completes
    }
  }
  const temperatureType = [
    { label: 'Hot', value: 'Hot' },
    { label: 'Cold', value: 'Cold' },
    { label: 'Normal', value: 'Normal' },
  ]


  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        dispatch(toggleLoading()); // Start loading for fetching all categories
        const menuRef = firestore().collection('restaurants').doc(restaurantId).collection('menu')
        const menuSnapshot = await menuRef.get()
        const categoryRefs = new Set()

        await Promise.all(menuSnapshot.docs.map(async (doc) => {
          const itemData = doc.data()
          const catPromises = itemData.categories.map(catRef => catRef.get())
          let catDocs = await Promise.all(catPromises)
          catDocs.forEach(doc => {
            categoryRefs.add(doc)
          });
        }));

        const categoriesData = Array.from(categoryRefs).reduce((acc, doc) => {
          acc.set(doc.data()?.name, {
            label: doc.data()?.name,
            value: doc.id
          });
          return acc;
        }, new Map()).values();

        const uniqueCategoriesData = Array.from(categoriesData);

        setCategories(uniqueCategoriesData);
      } catch (error) {
        console.error('Error fetching categories: ', error)
      } finally {
        dispatch(toggleLoading()); // Stop loading after fetching all categories completes
      }
    };

    fetchAllCategories();
  }, [itemId]);

  useEffect(() => {
    const fetchItemCategories = async () => {
      try {
        dispatch(toggleLoading()); // Start loading for fetching item categories
        const menuItemRef = firestore().collection('restaurants').doc(restaurantId).collection('menu').doc(itemId);
        const menuItemSnap = await menuItemRef.get();
        const menuItemData = menuItemSnap.data();
        const selectedCatDocs = await Promise.all(menuItemData.categories.map(catRef => catRef.get()));
        const selectedCatIds = selectedCatDocs.map(doc => doc.id);

        setSelectedCategories(selectedCatIds);
      } catch (error) {
        console.error('Error fetching item categories: ', error)
      } finally {
        dispatch(toggleLoading()); // Stop loading after fetching item categories completes
      }
    };

    if (itemId) {
      fetchItemCategories();
    }
  }, [itemId]);


  useEffect(() => {
    const fetchItem = async () => {
      try {
        dispatch(toggleLoading())
        const fetchedItem = await firestore()
          .collection('restaurants')
          .doc(restaurantId)
          .collection('menu')
          .doc(itemId)
          .get()

        const itemData = fetchedItem.data()
        setState({
          thumbnailUrl: itemData.thumbnailUrl,
          name: itemData.name,
          description: itemData.description,
          temperature: itemData.temperature,
          categories: itemData.categories,
          availability: itemData.availability || { from: '', until: '' },
          size: itemData.size || { length: null, breadth: null, height: null }
        })
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(toggleLoading()); // Stop loading after fetching completes
      }
    }
    fetchItem()
  }, [])

  const handleTextChange = (newValue, path) => {
    setState(prevState => {
      const levels = path.split('.');
      const lastLevel = levels.pop();
      const lastRef = levels.reduce((acc, cur) => acc[cur], prevState);
      lastRef[lastLevel] = newValue;
      return { ...prevState };
    });
  };

  const handleSaveChanges = async () => {
    dispatch(toggleLoading())
    Alert.alert('Save Changes', 'Are you sure you want to save these changes', [
      {
        text: 'Cancel',
        onPress: () => dispatch(toggleLoading()),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const categoriesRefs = selectedCategories.map(id =>
              firestore().collection('menuCategories').doc(id)
            );
            const updatedData = {
              thumbnailUrl: state.thumbnailUrl,
              name: state.name,
              description: state.description,
              temperature: state.temperature,
              categories: categoriesRefs,
              availability: state.availability || { from: '', until: '' },
              size: state.size || { length: null, breadth: null, height: null },
            };
            await firestore()
              .collection('restaurants')
              .doc(restaurantId)
              .collection('menu')
              .doc(itemId)
              .update(updatedData);
            navigation.goBack();
          } catch (error) {
            console.error('Failed to save changes: ', error);
            Alert.alert('Failed to save changes');
          } finally {
            dispatch(toggleLoading()); // Turn off loading after operation completes
          }
        },
      },
    ]);
  };


  const handleDelete = async () => {
    dispatch(toggleLoading())
    Alert.alert('Delete', 'Are you sure you want to delete this item', [
      {
        text: 'Cancel',
        onPress: () => dispatch(toggleLoading()),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await firestore()
              .collection('restaurants')
              .doc(restaurantId)
              .collection('menu')
              .doc(itemId)
              .delete();
            navigation.goBack()
          } catch (error) {
            console.error('Failed to delete item: ', error);
            Alert.alert('Failed to delete item');
          } finally {
            dispatch(toggleLoading()); // Turn off loading after operation completes
          }
        },
      },
    ]);
  };

  return (
    <Layout
      backTitle='Edit Item'
      navigation={navigation}
    >
      <ScrollView>
        {isLoading && <ActivityIndicator size="large" color={colors.theme} />}
        <View style={[styles.section, GlobalStyles.lightBorder]}>
          <View style={styles.row}>
            <Text style={styles.label}>Thumbnail</Text>
            <View style={styles.thumbnailContainer}>
              <Image style={styles.thumbnail} source={{ uri: imageUrl ? imageUrl : state.thumbnailUrl }} />
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.uploadIconContainer}>
                <Image style={{ width: 24, height: 24 }} source={require('images/upload.png')} />
              </TouchableOpacity>
            </View>
          </View>
          <Input
            label='Name'
            value={state.name}
            onChangeText={(newValue) => handleTextChange(newValue, 'name')}
          />
          <Input
            label='Description'
            multiline={true}
            value={state.description}
            onChangeText={(newValue) => handleTextChange(newValue, 'description')}
          />
        </View>

        <View style={[styles.section, GlobalStyles.lightBorder]}>
          <Text style={styles.title}>Availability time</Text>
      
          <View style={styles.row}>
            <View>
              <TimeInput
                label='From'
                value={state.availability.from}
                onChangeTime={(newValue) => handleTextChange(newValue, 'availability.from')}
              />
            </View>
            <View style={styles.distanceBar}>
              <View style={styles.dot}></View>
              <View style={styles.dashedLine}></View>
              <View style={styles.dot}></View>
            </View>
            <View>
              <TimeInput
                label='Until'
                value={state.availability.until}
                onChangeTime={(newValue) => handleTextChange(newValue, 'availability.until')}
              />

            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Temperature type</Text>
            <Dropdown
              style={styles.dropdown}
              data={temperatureType}
              selectedTextStyle={styles.activeText}
              itemTextStyle={styles.dropdownText}
              iconColor={colors.theme}
              iconStyle={styles.dropdownIcon}
              labelField="label"
              valueField="value"
              placeholder="Select temperature"
              value={state.temperature}
              onChange={item => handleTextChange(item.value, 'temperature')}
            />
          </View>

          <View>
            {/* <Text style={styles.label}>Category/categories</Text> */}
            <MultiSelect
              style={[styles.input, { width: '100%', marginTop: 10 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedText}
              inputSearchStyle={styles.inputSearchStyle}
              iconColor={colors.theme}
              iconStyle={styles.dropdownIcon}
              search
              data={categories}
              labelField="label"
              valueField="value"
              value={selectedCategories}
              placeholder='Select Category/Categories'
              searchPlaceholder="Search..."
              onChange={(item) => setSelectedCategories(item)}
              itemTextStyle={styles.itemText}
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.textSelectedStyle}>{item.label}</Text>
                    <Image style={{ tintColor: 'gray', width: 16, height: 16 }} source={require('images/x.png')} />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        <View style={[styles.section, GlobalStyles.lightBorder]}>
          <Text style={styles.title}>Size of the product</Text>
          <Input
            label='Length'
            numeric
            textColor
            cm
            value={state.size?.length.toString()}
            onChangeText={(newValue) => handleTextChange(newValue, 'size.length')}
          />
          <Input
            label='Breadth'
            numeric
            textColor
            cm
            value={state.size?.breadth.toString()}
            onChangeText={(newValue) => handleTextChange(newValue, 'size.breadth')}
          />
          <Input
            label='Height'
            numeric
            textColor
            cm
            value={state.size?.height.toString()}
            onChangeText={(newValue) => handleTextChange(newValue, 'size.height')}
          />
        </View>
        {isLoading? 
        <ActivityIndicator size="large" color={colors.theme} />
        :<View style={styles.bottomSection}>
          <ColouredButton
            bgColor='#CAD5DD'
            textColor={colors.theme}
            title='Save changes'
            onPress={() => handleSaveChanges()}
          />
          <ColouredButton
            bgColor={colors.warning}
            textColor={colors.danger}
            title='Delete Item'
            onPress={() => handleDelete()}
          />
        </View>}
      </ScrollView>
      {!isLoading?
      <UploadImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTakePicture={() => handleUploadImage(true)}
        onUploadFromGallery={() => handleUploadImage(false)}
      />: null}
    </Layout>
  )
}

export default EditItemScreen

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbnailContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    borderColor: 'transparent',
    width: '60%',
    padding: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbnail: {
    width: 75,
    height: 75,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  uploadIconContainer: {
    backgroundColor: '#CAD5DD',
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#646464',
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    borderColor: 'transparent',
    width: '60%',
    paddingHorizontal: 8,
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    position: 'relative',
  },
  availabilityLabel: {
    color: colors.theme,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 4,
  },
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
  label: {
    color: colors.darkGray,
    fontSize: 12,
    fontWeight: '600',
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'gray',
  },
  dropdownIcon: {
    backgroundColor: '#CAD5DD',
    borderRadius: 6,
    width: 24,
    height: 24,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.theme,
  },
  dropdown: {
    width: '60%',
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 10,
  },
  placeholderStyle: {
    fontSize: 12,
    color: 'gray',
    fontWeight: '600',
    textAlign: 'center'
  },
  selectedText: {
    // fontSize: 44,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#CAD5DD',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 12,
  },
  cm: {
    position: 'absolute',
    right: 10,
    top: '25%',
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
})