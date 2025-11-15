import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, textStyles, containerStyles } from '../theme';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, profile, signOut } = useAuth();

  return (
    <View style={containerStyles.centered}>
      <Text style={styles.logo}>StatsGames</Text>
      <Text style={styles.title}>Welcome{profile?.username ? `, ${profile.username}` : ''}!</Text>
      {user && (
        <Text style={styles.email}>{user.email}</Text>
      )}
      <Text style={styles.description}>
        Your game statistics dashboard will be here.
      </Text>
      
      {user && (
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    ...textStyles.h2,
    color: colors.primary,
    marginBottom: 24,
  },
  title: {
    ...textStyles.h1,
    marginBottom: 16,
  },
  email: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  description: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  signOutButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
