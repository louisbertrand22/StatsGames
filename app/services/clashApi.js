import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clash of Clans API Service
 * Handles calls to the backend API with caching support
 */

// Backend API base URL
const API_BASE_URL = 'https://stats-games-api-backend.vercel.app';

// Cache configuration
const CACHE_PREFIX = 'clash_api_cache_';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get cache key for player data
 * @param {string} playerTag - The player tag
 * @returns {string} Cache key
 */
const getCacheKey = (playerTag) => {
  return `${CACHE_PREFIX}player_${playerTag}`;
};

/**
 * Get cached data if available and not expired
 * @param {string} cacheKey - The cache key
 * @returns {Promise<object|null>} Cached data or null if expired/not found
 */
const getCachedData = async (cacheKey) => {
  try {
    const cachedItem = await AsyncStorage.getItem(cacheKey);
    if (!cachedItem) {
      return null;
    }

    const { data, timestamp } = JSON.parse(cachedItem);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_TTL) {
      return data;
    }

    // Cache expired, remove it
    await AsyncStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

/**
 * Save data to cache with timestamp
 * @param {string} cacheKey - The cache key
 * @param {object} data - Data to cache
 * @returns {Promise<void>}
 */
const setCachedData = async (cacheKey, data) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
};

/**
 * Clear all cached player data
 * @returns {Promise<void>}
 */
export const clearCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Fetch player data from backend API
 * @param {string} playerTag - The player tag (e.g., #ABC123XYZ)
 * @param {boolean} forceRefresh - Force refresh from API, bypass cache
 * @returns {Promise<{data: object|null, error: object|null, cached: boolean}>}
 */
export const fetchPlayerData = async (playerTag, forceRefresh = false) => {
  if (!playerTag || !playerTag.trim()) {
    return {
      data: null,
      error: { message: 'Player tag is required' },
      cached: false,
    };
  }

  const cacheKey = getCacheKey(playerTag);

  // Try to get from cache first if not forcing refresh
  if (!forceRefresh) {
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      return {
        data: cachedData,
        error: null,
        cached: true,
      };
    }
  }

  // Fetch from API
  try {
    const encodedTag = encodeURIComponent(playerTag);
    const url = `${API_BASE_URL}/player?tag=${encodedTag}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        data: null,
        error: {
          status: response.status,
          message: errorData.error || `HTTP error ${response.status}`,
          details: errorData.details,
        },
        cached: false,
      };
    }

    const data = await response.json();

    // Cache the successful response
    await setCachedData(cacheKey, data);

    return {
      data,
      error: null,
      cached: false,
    };
  } catch (error) {
    console.error('Error fetching player data:', error);
    return {
      data: null,
      error: {
        message: error.message || 'Network error',
        details: error.toString(),
      },
      cached: false,
    };
  }
};

/**
 * Check if backend API is available
 * @returns {Promise<{available: boolean, error: object|null}>}
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
    });

    return {
      available: response.ok,
      error: null,
    };
  } catch (error) {
    console.error('Error checking API health:', error);
    return {
      available: false,
      error: {
        message: error.message || 'Cannot reach backend API',
      },
    };
  }
};
