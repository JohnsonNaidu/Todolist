import React, { useState } from 'react';
import { View, StyleSheet, Button, TextInput, Text, Platform, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have installed react-native-vector-icons

export default function TaskScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const navigation = useNavigation();

    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12 for AM/PM format.
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    };
    
    const handleAddTask = () => {
        let missingFields = [];

        if (!title.trim()) missingFields.push('Title');
        if (!description.trim()) missingFields.push('Description');
        if (!date) missingFields.push('Date');
        if (!time) missingFields.push('Time');

        if (missingFields.length > 0) {
            Alert.alert(
                'Missing Fields',
                `Please fill in the following fields: ${missingFields.join(', ')}.`
            );
        } else {
            navigation.navigate('Home', { 
                newTask: { 
                    title, 
                    description, 
                    date: date.toDateString(), 
                    time: formatTime(time)
                } 
            });
        }
    };

    const showDatepicker = () => setShowDatePicker(true);
    const showTimepicker = () => setShowTimePicker(true);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) setTime(selectedTime);
    };

    return (
        <View style={styles.container}>
            {/* Title Section */}
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.inputLine}
                placeholder="Enter the title"
                value={title}
                onChangeText={setTitle}
            />

            {/* Description Section */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.inputLine, styles.textArea]}
                placeholder="Enter the description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

            {/* Date Section */}
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputIconContainer}>
                <TextInput
                    style={styles.inputLineWithIcon}
                    placeholder="Select date"
                    value={date ? date.toDateString() : ''}
                    editable={false}
                />
                <TouchableOpacity onPress={showDatepicker}>
                    <Icon name="date-range" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={date || new Date()} 
                    mode="date"
                    display={Platform.OS === 'android' ? 'inline' : 'default'}
                    minimumDate={new Date()}
                    onChange={handleDateChange}
                />
            )}

            {/* Time Section */}
            <Text style={styles.label}>Time</Text>
            <View style={styles.inputIconContainer}>
                <TextInput
                    style={styles.inputLineWithIcon}
                    placeholder="Select time"
                    value={time ? time.toLocaleTimeString() : ''}
                    editable={false}
                />
                <TouchableOpacity onPress={showTimepicker}>
                    <Icon name="access-time" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {showTimePicker && (
                <DateTimePicker
                    value={time || new Date()}
                    mode="time"
                    display={Platform.OS === 'android' ? 'inline' : 'default'}
                    onChange={handleTimeChange}
                />
            )}

            {/* Add Task Button */}
            <Button title="Add Task" onPress={handleAddTask} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
        fontWeight: 'bold',
    },
    inputLine: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingVertical: 8,
        marginBottom: 20,
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'bottom',
    },
    inputIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 20,
    },
    inputLineWithIcon: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        color: 'black',
    },
    textArea: {
        height: 50,
        textAlignVertical: 'bottom',
    },
});
