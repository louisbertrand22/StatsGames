import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Linking } from 'react-native';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NFCShareScreen from '../screens/NFCShareScreen';
import NFCProfileScreen from '../screens/NFCProfileScreen';
import GamesScreen from '../screens/GamesScreen';
import GameDetailScreen from '../screens/GameDetailScreen';
import { useAuth } from '../contexts/AuthContext';
import { colors, containerStyles } from '../theme';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['https://statsgames.app', 'statsgames://'],
  config: {
    screens: {
      NFCProfile: 'nfc/:token',
      Home: '',
      Profile: 'profile',
      Settings: 'settings',
      NFCShare: 'nfc-share',
      Games: 'games',
      GameDetail: 'games/:gameId',
      Login: 'login',
    },
  },
};

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const navigationRef = useRef();

  useEffect(() => {
    // Handle initial URL when app is opened via link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle URL when app is already running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleDeepLink = (url) => {
    if (!url || !navigationRef.current) return;

    // Parse NFC token from URL
    const nfcMatch = url.match(/\/nfc\/([a-zA-Z0-9]+)/);
    
    if (nfcMatch && nfcMatch[1]) {
      const token = nfcMatch[1];
      navigationRef.current?.navigate('NFCProfile', { token });
    }
  };

  if (loading) {
    return (
      <View style={containerStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          // Authenticated routes
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="NFCShare" component={NFCShareScreen} />
            <Stack.Screen name="Games" component={GamesScreen} />
            <Stack.Screen name="GameDetail" component={GameDetailScreen} />
          </>
        ) : (
          // Non-authenticated routes
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
        
        {/* Public routes accessible without authentication - last so not default */}
        <Stack.Screen name="NFCProfile" component={NFCProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}