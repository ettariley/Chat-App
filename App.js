// Basic React & React Native imports
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import 'react-native-gesture-handler';

// React Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Imports for pages to navigate between
import Start from './components/Start';
import Chat from './components/Chat';

// Create Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.appContainer}>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
});
