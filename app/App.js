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
    // <AuthProvider>
    //   <AppNavigator />
    //   <StatusBar style="dark" />
    // </AuthProvider>
    // Temporarily disable auth context to debug navigation issues
    <AuthProvider>
      {/* <AppNavigator /> */}
      {/* <StatusBar style="dark" /> */}
      {/* <View >
        <Text>StatsGames</Text>
        <Text >Game Statistics with NFC</Text>
        <ActivityIndicator 
          size="large" 
        />
      </View> */}
      <NavigationContainer>
        <Stack.Navigator
        // screenOptions={{
        //   headerShown: false,
        // }}
      >
        {/* <Stack.Screen name="Loading" component={LoadingScreen} /> */}
      </Stack.Navigator>
        
      </NavigationContainer>
    </AuthProvider>
    
  );
}
