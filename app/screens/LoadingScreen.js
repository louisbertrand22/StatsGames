import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, textStyles, containerStyles } from '../theme';
import { useLanguage } from '../contexts/LanguageContext';

export default function LoadingScreen({ navigation }) {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Simulate loading time, then navigate to Home
    const timer = setTimeout(() => {
      // navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View >
      <Text style={styles.logo}>{t('appName')}</Text>
      <Text style={styles.subtitle}>{t('gameStatisticsWithNFC')}</Text>
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