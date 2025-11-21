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
import { LinearGradient } from 'expo-linear-gradient';
import { lightColors, darkColors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchGames, fetchUserGames } from '../services/games';

export default function GamesScreen({ navigation }) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [games, setGames] = useState([]);
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;
  const styles = getStyles(colors);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    // Reload games when user navigates back to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadGames();
    });

    return unsubscribe;
  }, [navigation]);

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

  const renderGameCard = (game) => {
    const linked = isGameLinked(game.id);
    const userGame = userGames.find(ug => ug.game_id === game.id);

    return (
      <TouchableOpacity 
        key={game.id} 
        style={styles.gameCard}
        onPress={() => navigation.navigate('GameDetail', { game })}
        activeOpacity={0.7}
      >
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
            {linked && userGame?.game_tag && (
              <Text style={styles.gameTag} numberOfLines={1}>
                Tag: {userGame.game_tag}
              </Text>
            )}
          </View>
        </View>
        
        <Text style={styles.arrowIcon}>›</Text>
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.title}>Available Games</Text>
          <Text style={styles.subtitle}>
            Link games to your profile to share your stats
          </Text>
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
    marginBottom: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.95,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
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
    backgroundColor: colors.primaryAlpha,
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
  gameTag: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 32,
    color: colors.textSecondary,
    fontWeight: '300',
  },
});
