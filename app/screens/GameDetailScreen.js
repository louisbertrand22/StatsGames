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
import { fetchPlayerData } from '../services/clashApi';
import { upsertGameStats, deleteGameStats } from '../services/gameStats';

export default function GameDetailScreen({ navigation, route }) {
  const { game } = route.params; // Passed from GamesScreen
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [gameTag, setGameTag] = useState('');
  const [originalGameTag, setOriginalGameTag] = useState(''); // Track original tag for cancel
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userGame, setUserGame] = useState(null);
  const [isLinked, setIsLinked] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [loadingPlayerData, setLoadingPlayerData] = useState(false);
  const [playerDataError, setPlayerDataError] = useState(null);
  const [isEditingTag, setIsEditingTag] = useState(false);

  // Get colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;
  const styles = getStyles(colors);

  useEffect(() => {
    loadUserGame();
  }, []);

  useEffect(() => {
    // Load player data when tag is available for Clash of Clans
    if (isLinked && gameTag && game.slug === 'clash-of-clans') {
      loadPlayerData(gameTag);
    }
  }, [isLinked, gameTag, game.slug]);

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
      const tag = linkedGame.game_tag || '';
      setGameTag(tag);
      setOriginalGameTag(tag); // Store original for cancel functionality
    }

    setLoading(false);
  };

  const loadPlayerData = async (tag, forceRefresh = false) => {
    if (!tag || game.slug !== 'clash-of-clans') return;

    setLoadingPlayerData(true);
    setPlayerDataError(null);

    const { data, error, cached } = await fetchPlayerData(tag, forceRefresh);
    
    if (error) {
      console.error('Error loading player data:', error);
      setPlayerDataError(error.message || 'Failed to load player data');
      setPlayerData(null);
    } else {
      setPlayerData(data);
      if (cached) {
        console.log('Loaded player data from cache');
      } else {
        console.log('Loaded fresh player data from API');
      }
      
      // Store stats in database
      const { error: statsError } = await upsertGameStats(user.id, game.id, data);
      if (statsError) {
        console.error('Error saving game stats to database:', statsError);
        // Don't show error to user since stats display still works
      } else {
        console.log('Successfully saved game stats to database');
      }
    }

    setLoadingPlayerData(false);
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
      setOriginalGameTag(gameTag); // Update original tag after successful save
      setIsEditingTag(false); // Close edit mode after successful save
      // Load player data after saving tag for Clash of Clans
      if (game.slug === 'clash-of-clans' && gameTag) {
        loadPlayerData(gameTag, true); // Force refresh to get latest data
      }
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
        setSaving(false);
      } else {
        // Delete associated game stats
        const { error: deleteStatsError } = await deleteGameStats(user.id, game.id);
        if (deleteStatsError) {
          console.error('Error deleting game stats:', deleteStatsError);
          // Continue even if stats deletion fails
        }
        
        setIsLinked(false);
        setUserGame(null);
        setGameTag('');
        setOriginalGameTag(''); // Clear original tag when unlinking
        setPlayerData(null); // Clear player data when unlinking
        setSaving(false);
        Alert.alert('Success', `${game.name} has been removed from your profile.`);
      }
    } else {
      // Link the game
      const tagToSave = gameTag?.trim() || null;
      const { data, error } = await linkGameToUser(user.id, game.id, tagToSave);
      if (error) {
        Alert.alert('Error', 'Failed to add game. Please try again.');
        console.error('Link error:', error);
        setSaving(false);
      } else {
        setIsLinked(true);
        setUserGame(data);
        setSaving(false);
        Alert.alert('Success', `${game.name} has been added to your profile.`);
      }
    }
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

            {/* Player Stats Section - Only for Clash of Clans */}
            {game.slug === 'clash-of-clans' && isLinked && gameTag && !isEditingTag && (
              <View style={styles.section}>
                <View style={styles.statsHeader}>
                  <Text style={styles.sectionTitle}>Player Stats</Text>
                  <View style={styles.statsHeaderButtons}>
                    {playerData && (
                      <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={() => loadPlayerData(gameTag, true)}
                        disabled={loadingPlayerData}
                      >
                        <Text style={styles.refreshButtonText}>
                          {loadingPlayerData ? '...' : '↻ Refresh'}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => setIsEditingTag(true)}
                    >
                      <Text style={styles.editButtonText}>✏️ Edit Tag</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {loadingPlayerData ? (
                  <View style={styles.statsLoadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.statsLoadingText}>Loading player data...</Text>
                  </View>
                ) : playerDataError ? (
                  <View style={styles.errorCard}>
                    <Text style={styles.errorTitle}>⚠️ Unable to Load Stats</Text>
                    <Text style={styles.errorText}>{playerDataError}</Text>
                    <TouchableOpacity
                      style={[styles.button, styles.retryButton]}
                      onPress={() => loadPlayerData(gameTag, true)}
                    >
                      <Text style={styles.buttonText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : playerData ? (
                  <View style={styles.statsCard}>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Name:</Text>
                      <Text style={styles.statsValue}>{playerData.name}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Tag:</Text>
                      <Text style={styles.statsValue}>{playerData.tag}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Town Hall:</Text>
                      <Text style={styles.statsValue}>Level {playerData.townHallLevel}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Trophies:</Text>
                      <Text style={styles.statsValue}>{playerData.trophies?.toLocaleString() || 'N/A'}</Text>
                    </View>
                    <View style={styles.statsRow}>
                      <Text style={styles.statsLabel}>Experience:</Text>
                      <Text style={styles.statsValue}>Level {playerData.expLevel}</Text>
                    </View>
                    {playerData.clan && (
                      <View style={styles.statsRow}>
                        <Text style={styles.statsLabel}>Clan:</Text>
                        <Text style={styles.statsValue}>{playerData.clan.name}</Text>
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
            )}

            {/* Game Tag Section */}
            {requiresTag && (!gameTag || isEditingTag) && (
              <View style={styles.section}>
                <View style={styles.tagEditHeader}>
                  <Text style={styles.sectionTitle}>{tagLabel}</Text>
                  {isEditingTag && gameTag && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsEditingTag(false);
                        // Reset to saved value if canceling
                        setGameTag(originalGameTag);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.sectionDescription}>
                  {tagDescription}
                </Text>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, !isLinked && styles.inputDisabled]}
                    value={gameTag}
                    onChangeText={setGameTag}
                    placeholder={tagPlaceholder}
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="characters"
                    editable={isLinked && !saving}
                  />
                </View>

                {isLinked && (
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSaveTag}
                    disabled={saving || !gameTag?.trim()}
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
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: colors.border,
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
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsHeaderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  refreshButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  refreshButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tagEditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  statsLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsLoadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  statsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  statsValue: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    marginTop: 8,
  },
});
