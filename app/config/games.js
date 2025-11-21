/**
 * Game Configuration
 * 
 * This file defines game-specific settings and requirements.
 */

/**
 * Games that require player tags/identifiers
 * Add game slugs to this array to enable tag input for those games
 */
export const GAMES_REQUIRING_TAGS = [
  'clash-of-clans',
  // Add more game slugs here as needed
  // 'clash-royale',
  // 'fortnite',
];

/**
 * Check if a game requires a player tag
 * @param {string} gameSlug - The slug of the game
 * @returns {boolean} - True if the game requires a tag
 */
export const requiresPlayerTag = (gameSlug) => {
  return GAMES_REQUIRING_TAGS.includes(gameSlug);
};

/**
 * Get tag label for a specific game
 * @param {string} gameSlug - The slug of the game
 * @returns {string} - Label text for the tag input
 */
export const getTagLabel = (gameSlug) => {
  const labels = {
    'clash-of-clans': 'Player Tag',
    'clash-royale': 'Player Tag',
    'fortnite': 'Epic ID',
    'rocket-league': 'Player ID',
  };
  
  return labels[gameSlug] || 'Player Tag';
};

/**
 * Get tag placeholder for a specific game
 * @param {string} gameSlug - The slug of the game
 * @returns {string} - Placeholder text for the tag input
 */
export const getTagPlaceholder = (gameSlug) => {
  const placeholders = {
    'clash-of-clans': '#ABC123XYZ',
    'clash-royale': '#ABC123XYZ',
    'fortnite': 'EpicUsername',
    'rocket-league': 'SteamID or PSN',
  };
  
  return placeholders[gameSlug] || '#EXAMPLE';
};

/**
 * Get tag description for a specific game
 * @param {string} gameSlug - The slug of the game
 * @returns {string} - Description text for the tag input
 */
export const getTagDescription = (gameSlug) => {
  const descriptions = {
    'clash-of-clans': 'Enter your Clash of Clans player tag to load your profile stats. You can find your tag in-game by tapping your profile.',
    'clash-royale': 'Enter your Clash Royale player tag. You can find it in-game by tapping your profile.',
    'fortnite': 'Enter your Epic Games username or account ID.',
    'rocket-league': 'Enter your platform ID (Steam, PSN, Xbox Live, or Epic).',
  };
  
  return descriptions[gameSlug] || 'Enter your player identifier for this game.';
};
