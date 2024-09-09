import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {
    const [tasks, setTasks] = useState([]);
    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        if (route.params?.newTask) {
            setTasks(prevTasks => [...prevTasks, route.params.newTask]);
        }

        if (route.params?.updatedTask && route.params?.index !== undefined) {
            setTasks(prevTasks => {
                const updatedTasks = [...prevTasks];
                updatedTasks[route.params.index] = route.params.updatedTask;
                return updatedTasks;
            });
        }
    }, [route.params?.newTask, route.params?.updatedTask]);

    const handleDelete = (index) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", onPress: () => {}, style: "cancel" },
                { text: "Delete", onPress: () => {
                    setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
                }},
            ]
        );
    };

    const handleEdit = (task, index) => {
        navigation.navigate('EditTask', { task, index });
    };

    return (
        <View style={styles.container}>
            {tasks.map((task, index) => (
                <View key={index} style={styles.taskContainer}>
                    <Text style={styles.taskItem}>{task.title}</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => handleEdit(task, index)} style={styles.editButton}>
                            <Icon name="edit" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
                            <Icon name="delete" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <Button
                title="Go to Add Task"
                onPress={() => navigation.navigate('Task')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    taskItem: {
        fontSize: 18,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        flex: 1, // Adjusted to take up the remaining space
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        padding: 10,
        backgroundColor: 'yellow',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    deleteButton: {
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
