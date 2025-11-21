import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { lightColors, darkColors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchUserGames, updateGameTag, linkGameToUser, unlinkGameFromUser } from '../services/games';
import { requiresPlayerTag, getTagLabel, getTagPlaceholder, getTagDescription } from '../config/games';

export default function GameDetailScreen({ navigation, route }) {
  const { game } = route.params; // Passed from GamesScreen
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [gameTag, setGameTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userGame, setUserGame] = useState(null);
  const [isLinked, setIsLinked] = useState(false);

  // Get colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;
  const styles = getStyles(colors);

  useEffect(() => {
    loadUserGame();
  }, []);

  const loadUserGame = async () => {
    setLoading(true);
    
    const { data: userGamesData, error } = await fetchUserGames(user.id);
    if (error) {
      console.error('Error loading user games:', error);
      setLoading(false);
      return;
    }

    // Find this specific game in user's linked games
    const linkedGame = userGamesData?.find(ug => ug.game_id === game.id);
    if (linkedGame) {
      setUserGame(linkedGame);
      setIsLinked(true);
      setGameTag(linkedGame.game_tag || '');
    }

    setLoading(false);
  };

  const handleSaveTag = async () => {
    if (!isLinked) {
      Alert.alert('Error', 'Please link this game to your profile first.');
      return;
    }

    setSaving(true);

    const { error } = await updateGameTag(user.id, game.id, gameTag);
    
    if (error) {
      Alert.alert('Error', 'Failed to save tag. Please try again.');
      console.error('Save tag error:', error);
    } else {
      Alert.alert('Success', 'Game tag saved successfully!');
    }

    setSaving(false);
  };

  const handleToggleLink = async () => {
    setSaving(true);

    if (isLinked) {
      // Unlink the game
      const { error } = await unlinkGameFromUser(user.id, game.id);
      if (error) {
        Alert.alert('Error', 'Failed to remove game. Please try again.');
        console.error('Unlink error:', error);
      } else {
        setIsLinked(false);
        setUserGame(null);
        setGameTag('');
        Alert.alert('Success', `${game.name} has been removed from your profile.`);
      }
    } else {
      // Link the game
      const { data, error } = await linkGameToUser(user.id, game.id, gameTag || null);
      if (error) {
        Alert.alert('Error', 'Failed to add game. Please try again.');
        console.error('Link error:', error);
      } else {
        setIsLinked(true);
        setUserGame(data);
        Alert.alert('Success', `${game.name} has been added to your profile.`);
      }
    }

    setSaving(false);
  };

  const requiresTag = requiresPlayerTag(game.slug);
  const tagLabel = getTagLabel(game.slug);
  const tagPlaceholder = getTagPlaceholder(game.slug);
  const tagDescription = getTagDescription(game.slug);

  return (
    <View style={styles.container}>
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={colors.gradients.blue}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← {t('back')}</Text>
          </TouchableOpacity>
          
          <View style={styles.gameHeader}>
            {game.icon_url ? (
              <Image 
                source={{ uri: game.icon_url }} 
                style={styles.gameIcon}
              />
            ) : (
              <View style={styles.gameIconPlaceholder}>
                <Text style={styles.gameIconText}>
                  {game.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.gameHeaderInfo}>
              <Text style={styles.title}>{game.name}</Text>
              <Text style={styles.subtitle}>@{game.slug}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            {/* Link Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={[styles.statusCard, isLinked && styles.statusCardLinked]}>
                <Text style={[styles.statusText, isLinked && styles.statusTextLinked]}>
                  {isLinked ? '✓ Linked to your profile' : 'Not linked'}
                </Text>
              </View>
            </View>

            {/* Game Tag Section */}
            {requiresTag && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{tagLabel}</Text>
                <Text style={styles.sectionDescription}>
                  {tagDescription}
                </Text>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={gameTag}
                    onChangeText={setGameTag}
                    placeholder={tagPlaceholder}
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="characters"
                    editable={isLinked}
                  />
                </View>

                {isLinked && (
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSaveTag}
                    disabled={saving || !gameTag.trim()}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Save Tag</Text>
                    )}
                  </TouchableOpacity>
                )}

                {!isLinked && (
                  <Text style={styles.infoText}>
                    Link this game to your profile to add your player tag.
                  </Text>
                )}
              </View>
            )}

            {/* Action Button */}
            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.button,
                  isLinked ? styles.unlinkButton : styles.linkButton
                ]}
                onPress={handleToggleLink}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isLinked ? 'Remove from Profile' : 'Add to Profile'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.95,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  gameIconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameIconText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  gameHeaderInfo: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusCardLinked: {
    backgroundColor: colors.primaryAlpha,
    borderColor: colors.primary,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statusTextLinked: {
    color: colors.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  linkButton: {
    backgroundColor: colors.primary,
  },
  unlinkButton: {
    backgroundColor: colors.error,
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
