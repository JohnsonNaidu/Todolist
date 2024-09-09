import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function EditTaskScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { task, index } = route.params;

    const initializeDate = (dateString) => {
        const parsedDate = new Date(dateString);
        return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    };

    const initializeTime = (timeString) => {
        // Handling both 12-hour and 24-hour formats.
        const timeParts = timeString.split(':');
        let hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
    
        // Handle AM/PM
        if (timeString.toLowerCase().includes('pm') && hours < 12) {
            hours += 12;
        } else if (timeString.toLowerCase().includes('am') && hours === 12) {
            hours = 0;
        }
    
        return new Date(1970, 0, 1, hours, minutes);
    };

    const originalTitle = task.title || '';
    const originalDescription = task.description || '';
    const originalDate = initializeDate(task.date);
    const originalTime = initializeTime(task.time);

    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskDescription, setTaskDescription] = useState(task.description);
    const [date, setDate] = useState(initializeDate(task.date));
    const [time, setTime] = useState(initializeTime(task.time));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Check if any changes are made
        const hasTitleChanged = taskTitle !== originalTitle;
        const hasDescriptionChanged = taskDescription !== originalDescription;
        const hasDateChanged = date.getTime() !== originalDate.getTime();
        const hasTimeChanged = time.getTime() !== originalTime.getTime();

        setHasChanges(hasTitleChanged || hasDescriptionChanged || hasDateChanged || hasTimeChanged);
    }, [taskTitle, taskDescription, date, time]);

    const handleSave = () => {

        const formatTime = (date) => {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // Convert 0 to 12 for AM/PM format.
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return `${hours}:${minutes} ${ampm}`;
        };
    
        let missingFields = [];

        if (!taskTitle.trim()) missingFields.push('Title');
        if (!taskDescription.trim()) missingFields.push('Description');
        if (!date) missingFields.push('Date');
        if (!time) missingFields.push('Time');

        if (missingFields.length > 0) {
            Alert.alert('Missing Fields', `Please fill in the following fields: ${missingFields.join(', ')}`);
        } else {
            const updatedTask = {
                title: taskTitle.trim(),
                description: taskDescription.trim(),
                date: date.toDateString(),
                time: formatTime(time),
            };

            navigation.navigate('Home', { updatedTask, index });
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
                placeholder='Enter the title'
                value={taskTitle}
                onChangeText={setTaskTitle}
            />

            {/* Description Section */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.inputLine, styles.textArea]}
                placeholder='Enter the description'
                value={taskDescription}
                onChangeText={setTaskDescription}
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

           {/* Save Task Button */}
           {hasChanges && (
                <Button title="Save" onPress={handleSave} />
            )}
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
