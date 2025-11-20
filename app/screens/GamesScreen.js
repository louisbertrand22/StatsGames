import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { lightColors, darkColors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchGames, fetchUserGames, linkGameToUser, unlinkGameFromUser } from '../services/games';

export default function GamesScreen({ navigation }) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [games, setGames] = useState([]);
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Get colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;
  const styles = getStyles(colors);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    
    // Fetch all available games
    const { data: gamesData, error: gamesError } = await fetchGames();
    if (gamesError) {
      Alert.alert('Error', 'Failed to load games. Please try again.');
      console.error('Games error:', gamesError);
      setLoading(false);
      return;
    }

    // Fetch user's linked games
    const { data: userGamesData, error: userGamesError } = await fetchUserGames(user.id);
    if (userGamesError) {
      console.error('User games error:', userGamesError);
      // Continue even if this fails, just won't show linked status
    }

    setGames(gamesData || []);
    setUserGames(userGamesData || []);
    setLoading(false);
  };

  const isGameLinked = (gameId) => {
    return userGames.some(ug => ug.game_id === gameId);
  };

  const handleGameAction = async (game) => {
    const isLinked = isGameLinked(game.id);
    
    // Set loading state for this specific game
    setActionLoading(prev => ({ ...prev, [game.id]: true }));

    let result;
    if (isLinked) {
      // Unlink the game
      result = await unlinkGameFromUser(user.id, game.id);
      if (!result.error) {
        setUserGames(prev => prev.filter(ug => ug.game_id !== game.id));
        Alert.alert('Success', `${game.name} has been removed from your profile`);
      }
    } else {
      // Link the game
      result = await linkGameToUser(user.id, game.id);
      if (!result.error) {
        // Reload user games to get the complete data
        const { data: updatedUserGames } = await fetchUserGames(user.id);
        setUserGames(updatedUserGames || []);
        Alert.alert('Success', `${game.name} has been added to your profile`);
      }
    }

    if (result.error) {
      Alert.alert('Error', `Failed to ${isLinked ? 'remove' : 'add'} game. Please try again.`);
      console.error('Game action error:', result.error);
    }

    // Clear loading state for this game
    setActionLoading(prev => ({ ...prev, [game.id]: false }));
  };

  const renderGameCard = (game) => {
    const linked = isGameLinked(game.id);
    const isActionLoading = actionLoading[game.id];

    return (
      <View key={game.id} style={styles.gameCard}>
        <View style={styles.gameInfo}>
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
          <View style={styles.gameDetails}>
            <Text style={styles.gameName}>{game.name}</Text>
            <Text style={styles.gameSlug}>@{game.slug}</Text>
            {linked && (
              <View style={styles.linkedBadge}>
                <Text style={styles.linkedBadgeText}>✓ Linked</Text>
              </View>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            linked ? styles.unlinkButton : styles.linkButton
          ]}
          onPress={() => handleGameAction(game)}
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>
              {linked ? 'Remove' : 'Add'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← {t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Available Games</Text>
        <Text style={styles.subtitle}>
          Link games to your profile to share your stats
        </Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading games...</Text>
          </View>
        ) : games.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎮</Text>
            <Text style={styles.emptyTitle}>No Games Available</Text>
            <Text style={styles.emptyText}>
              Check back later for available games to link to your profile.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {userGames.length > 0 
                ? `${userGames.length} game${userGames.length !== 1 ? 's' : ''} linked`
                : 'No games linked yet'}
            </Text>
            {games.map(renderGameCard)}
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
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  gameCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gameIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  gameIconPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameIconText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  gameDetails: {
    marginLeft: 12,
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  gameSlug: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  linkedBadge: {
    marginTop: 4,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  linkedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  linkButton: {
    backgroundColor: colors.primary,
  },
  unlinkButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
