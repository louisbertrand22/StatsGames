import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles, containerStyles } from '../theme';

export default function HomeScreen() {
  return (
    <View style={containerStyles.centered}>
      <Text style={styles.logo}>StatsGames</Text>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.description}>
        Your game statistics dashboard will be here.
      </Text>
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
  description: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
