import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { lightColors, darkColors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomeScreen({ navigation }) {
  const { user, profile, signOut } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  
  // Get colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;
  const styles = getStyles(colors);

  // Icon background colors for each action card
  const iconColors = {
    games: isDarkMode ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 122, 255, 0.15)',
    profile: isDarkMode ? 'rgba(48, 209, 88, 0.2)' : 'rgba(52, 199, 89, 0.15)',
    settings: isDarkMode ? 'rgba(255, 159, 10, 0.2)' : 'rgba(255, 149, 0, 0.15)',
    nfc: isDarkMode ? 'rgba(191, 90, 242, 0.2)' : 'rgba(175, 82, 222, 0.15)',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header with Profile Picture and Gradient Background */}
      <LinearGradient
        colors={colors.gradients.blue}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.profileSection}>
            {profile?.avatar_url ? (
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: profile.avatar_url }} 
                  style={styles.profileImage}
                />
              </View>
            ) : (
              <View style={styles.profileImageContainer}>
                <LinearGradient
                  colors={isDarkMode ? ['#64D2FF', '#0A84FF'] : ['#5AC8FA', '#007AFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.profileImagePlaceholder}
                >
                  <Text style={styles.profileImageInitial}>
                    {profile?.username ? profile.username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
                  </Text>
                </LinearGradient>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>{t('welcome')}</Text>
              <Text style={styles.username}>{profile?.username || user?.email?.split('@')[0] || 'User'}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Welcome Card with Modern Design */}
      <View style={styles.welcomeCard}>
        <LinearGradient
          colors={isDarkMode ? ['rgba(10, 132, 255, 0.1)', 'rgba(10, 132, 255, 0.05)'] : ['rgba(0, 122, 255, 0.08)', 'rgba(0, 122, 255, 0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.welcomeCardGradient}
        >
          <Text style={styles.logo}>🎮 {t('appName')}</Text>
          <Text style={styles.description}>
            {t('welcomeMessage')}
          </Text>
        </LinearGradient>
      </View>
      
      {/* Action Cards with Modern Grid Layout */}
      {user && (
        <View style={styles.actionsContainer}>
          <View style={styles.gridRow}>
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => navigation.navigate('Games')}
            >
              <LinearGradient
                colors={isDarkMode ? ['rgba(10, 132, 255, 0.15)', 'rgba(10, 132, 255, 0.05)'] : ['rgba(0, 122, 255, 0.1)', 'rgba(0, 122, 255, 0.03)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCardGradient}
              >
                <View style={[styles.actionCardIcon, { backgroundColor: iconColors.games }]}>
                  <Text style={styles.actionCardEmoji}>🎮</Text>
                </View>
                <Text style={styles.actionCardTitle}>My Games</Text>
                <Text style={styles.actionCardDescription}>Link games to your profile</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => navigation.navigate('Profile')}
            >
              <LinearGradient
                colors={isDarkMode ? ['rgba(52, 199, 89, 0.15)', 'rgba(52, 199, 89, 0.05)'] : ['rgba(52, 199, 89, 0.1)', 'rgba(52, 199, 89, 0.03)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCardGradient}
              >
                <View style={[styles.actionCardIcon, { backgroundColor: iconColors.profile }]}>
                  <Text style={styles.actionCardEmoji}>👤</Text>
                </View>
                <Text style={styles.actionCardTitle}>{t('editProfile')}</Text>
                <Text style={styles.actionCardDescription}>{t('updateProfileInfo')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => navigation.navigate('Settings')}
            >
              <LinearGradient
                colors={isDarkMode ? ['rgba(255, 159, 10, 0.15)', 'rgba(255, 159, 10, 0.05)'] : ['rgba(255, 149, 0, 0.1)', 'rgba(255, 149, 0, 0.03)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCardGradient}
              >
                <View style={[styles.actionCardIcon, { backgroundColor: iconColors.settings }]}>
                  <Text style={styles.actionCardEmoji}>⚙️</Text>
                </View>
                <Text style={styles.actionCardTitle}>{t('settings')}</Text>
                <Text style={styles.actionCardDescription}>{t('customizePreferences')}</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => navigation.navigate('NFCShare', { autoGenerate: true })}
            >
              <LinearGradient
                colors={isDarkMode ? ['rgba(191, 90, 242, 0.15)', 'rgba(191, 90, 242, 0.05)'] : ['rgba(175, 82, 222, 0.1)', 'rgba(175, 82, 222, 0.03)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCardGradient}
              >
                <View style={[styles.actionCardIcon, { backgroundColor: iconColors.nfc }]}>
                  <Text style={styles.actionCardEmoji}>📱</Text>
                </View>
                <Text style={styles.actionCardTitle}>{t('startSharing')}</Text>
                <Text style={styles.actionCardDescription}>{t('generateTokenShare')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <LinearGradient
              colors={isDarkMode ? ['#FF453A', '#D32F2F'] : ['#FF3B30', '#D32F2F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signOutGradient}
            >
              <Text style={styles.signOutText}>{t('signOut')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImageInitial: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  greeting: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.95,
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  username: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  welcomeCard: {
    marginHorizontal: 24,
    marginTop: -24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  welcomeCardGradient: {
    padding: 28,
    backgroundColor: colors.surface,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginTop: 28,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCardGradient: {
    padding: 20,
    backgroundColor: colors.surface,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  actionCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primaryAlpha,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  actionCardEmoji: {
    fontSize: 28,
  },
  actionCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  actionCardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    fontWeight: '500',
  },
  signOutButton: {
    borderRadius: 16,
    marginTop: 16,
    overflow: 'hidden',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signOutGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});