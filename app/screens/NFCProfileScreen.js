import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { lightColors, darkColors } from '../theme';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getProfileByToken } from '../services/nfc';

export default function NFCProfileScreen({ route, navigation }) {
  const { token } = route.params || {};
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null); // 'expired', 'invalid', or 'other'

  // Get colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;
  const styles = getStyles(colors);

  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setError(t('noTokenProvided'));
      setErrorType('other');
      setLoading(false);
    }
  }, [token]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    setErrorType(null);

    try {
      const result = await getProfileByToken(token);

      if (result.error) {
        if (result.error.message === 'Token expired') {
          setError(t('linkExpired'));
          setErrorType('expired');
        } else if (result.error.message === 'Token not found') {
          setError(t('invalidLink'));
          setErrorType('invalid');
        } else {
          setError(t('failedToLoadProfile'));
          setErrorType('other');
        }
      } else {
        setProfileData(result);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(t('unexpectedError'));
      setErrorType('other');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { marginTop: 20 }]}>{t('loadingProfile')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>{error}</Text>
        <Text style={styles.errorText}>
          {errorType === 'expired'
            ? t('askForNewLink')
            : t('checkLinkAndRetry')}
        </Text>
        {navigation && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>{t('goBack')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!profileData?.user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{t('noProfileData')}</Text>
      </View>
    );
  }

  const { user, stats } = profileData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header with Gradient Background */}
        <LinearGradient
          colors={isDarkMode ? ['#0A84FF', '#0051D5', '#003DA5'] : ['#007AFF', '#0051D5', '#003DA5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            {navigation && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>← {t('back')}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>{t('sharedProfile')}</Text>
          </View>
        </LinearGradient>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {user.username?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.username}>
            {user.username || t('anonymousUser')}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('userId')}:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {user.id.substring(0, 8)}...
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('gameStatistics')}</Text>
          
          {stats && stats.length > 0 ? (
            stats.map((gameStat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  {gameStat.games?.icon_url && (
                    <Image
                      source={{ uri: gameStat.games.icon_url }}
                      style={styles.gameIcon}
                    />
                  )}
                  <Text style={styles.gameName}>
                    {gameStat.games?.name || t('unknownGame')}
                  </Text>
                </View>
                
                <View style={styles.statContent}>
                  {gameStat.stats && typeof gameStat.stats === 'object' ? (
                    Object.entries(gameStat.stats).map(([key, value], i) => (
                      <View key={i} style={styles.statRow}>
                        <Text style={styles.statKey}>
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                        </Text>
                        <Text style={styles.statValue}>{value}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noStatsText}>{t('noStatsAvailable')}</Text>
                  )}
                </View>

                {gameStat.updated_at && (
                  <Text style={styles.updatedText}>
                    {t('updated')}: {new Date(gameStat.updated_at).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {t('noGameStatsYet')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('profileSharedViaNFC')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      paddingBottom: 32,
    },
    headerGradient: {
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },
    header: {
      padding: 20,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingBottom: 32,
    },
    backButton: {
      marginBottom: 10,
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      opacity: 0.95,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
    },
    profileCard: {
      backgroundColor: colors.surface || colors.card,
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    avatarContainer: {
      marginBottom: 15,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarPlaceholderText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#fff',
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 5,
    },
    infoValue: {
      fontSize: 14,
      color: colors.text,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    section: {
      marginBottom: 20,
      marginHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
    },
    statCard: {
      backgroundColor: colors.surface || colors.card,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || '#ddd',
    },
    gameIcon: {
      width: 30,
      height: 30,
      borderRadius: 5,
      marginRight: 10,
    },
    gameName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    statContent: {
      marginTop: 10,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    statKey: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    updatedText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 10,
      fontStyle: 'italic',
    },
    noStatsText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    emptyState: {
      padding: 30,
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    footer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    footerText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    text: {
      fontSize: 16,
      color: colors.text,
    },
    errorIcon: {
      fontSize: 60,
      marginBottom: 20,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    errorText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
