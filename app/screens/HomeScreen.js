import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header with Profile Picture */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          {profile?.avatar_url ? (
            <Image 
              source={{ uri: profile.avatar_url }} 
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageInitial}>
                {profile?.username ? profile.username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>{t('welcome')}</Text>
            <Text style={styles.username}>{profile?.username || user?.email?.split('@')[0] || 'User'}</Text>
          </View>
        </View>
      </View>

      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <Text style={styles.logo}>{t('appName')}</Text>
        <Text style={styles.description}>
          {t('welcomeMessage')}
        </Text>
      </View>
      
      {/* Action Cards */}
      {user && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('Games')}
          >
            <View style={styles.actionCardIcon}>
              <Text style={styles.actionCardEmoji}>🎮</Text>
            </View>
            <Text style={styles.actionCardTitle}>My Games</Text>
            <Text style={styles.actionCardDescription}>Link games to your profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.actionCardIcon}>
              <Text style={styles.actionCardEmoji}>👤</Text>
            </View>
            <Text style={styles.actionCardTitle}>{t('editProfile')}</Text>
            <Text style={styles.actionCardDescription}>{t('updateProfileInfo')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.actionCardIcon}>
              <Text style={styles.actionCardEmoji}>⚙️</Text>
            </View>
            <Text style={styles.actionCardTitle}>{t('settings')}</Text>
            <Text style={styles.actionCardDescription}>{t('customizePreferences')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('NFCShare', { autoGenerate: true })}
          >
            <View style={styles.actionCardIcon}>
              <Text style={styles.actionCardEmoji}>📱</Text>
            </View>
            <Text style={styles.actionCardTitle}>{t('startSharing')}</Text>
            <Text style={styles.actionCardDescription}>{t('generateTokenShare')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.signOutText}>{t('signOut')}</Text>
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
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileImageInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    marginTop: -16,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  actionCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryAlpha,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionCardEmoji: {
    fontSize: 24,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  actionCardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  signOutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});