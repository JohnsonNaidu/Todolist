import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./screens/HomeScreen";
import TaskScreen from "./screens/TaskScreen";
import EditTaskScreen from './screens/EditTaskScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'To Do Lists',headerTitleAlign:'center'}}
        />
        <Stack.Screen 
          name="Task" 
          component={TaskScreen}
          options={{title:'Add Task',headerTitleAlign:'center'}} 
        />
         <Stack.Screen name="EditTask" component={EditTaskScreen} 
         options={{title:'Edit Task',headerTitleAlign:'center'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
