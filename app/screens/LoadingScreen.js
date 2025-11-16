import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, textStyles, containerStyles } from '../theme';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    // Simulate loading time, then navigate to Home
    const timer = setTimeout(() => {
      // navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View >
      <Text style={styles.logo}>StatsGames</Text>
      <Text style={styles.subtitle}>Game Statistics with NFC</Text>
      <ActivityIndicator 
        size="large" 
        color={colors.primary} 
        style={styles.loader} 
      />
    </View>
  );
}


const styles = StyleSheet.create({
  logo: {
    ...textStyles.h1,
    fontSize: 42,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});