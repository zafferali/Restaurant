import { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import colors from '../../../constants/colors';
import ColouredButton from 'common/ColouredButton';

const SelectDateModal = ({ visible, onClose, date, onDateChange, onAdd}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [validatedDate, setValidatedDate] = useState(new Date());

    useEffect(() => {
        if (date instanceof Date && !isNaN(date.getTime())) {
            setValidatedDate(date);
        } else {
            setValidatedDate(new Date()); 
        }
    }, [date]);

    const onChange = (event, selectedDate) => {
        if (selectedDate) {
            onDateChange(selectedDate);
        }
        setShowDatePicker(false);
    };

    const formatDate = (date) => {
        return date?.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        })
    };

    const handleAddOccasion = () => {
        onAdd()
        onClose()
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>New Occasion</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateDisplay}>
                    <Text style={styles.dateText}>{formatDate(validatedDate)}</Text>
                        <Image style={styles.dropdown} source={require('images/dropdown.png')}/>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePickerModal
                            testID="dateTimePicker"
                            display='spinner'
                            value={date}
                            mode="date"
                            onChange={onChange}
                        />
                    )}
                    <ColouredButton
                        bgColor={colors.theme}
                        textColor='white'
                        title='Add'
                        onPress={() => handleAddOccasion()}
                    />
                    <ColouredButton
                        bgColor='#688DA84D'
                        textColor='black'
                        title='Cancel'
                        onPress={() => onClose()}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    modalText: {
        marginBottom: 20,
        fontSize: 28,
        fontWeight: 'bold',
        color: 'black'
    },
    dateDisplay: {
        borderWidth: 3,
        borderColor: 'rgba(171, 171, 171, .3)',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginBottom: 10,
        position: 'relative',
    },
    dateText: {
        color: colors.theme,
        fontSize: 16,
         fontWeight: 'bold',
    },
    dropdown: {
        position: 'absolute',
        top: '35%',
        bottom: '-25%',
        right: 10,
        width: 24,
        height: 24
    }
});

export default SelectDateModal;
