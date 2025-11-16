import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './screens/LoadingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="dark" />
      </AuthProvider>
    );
}
