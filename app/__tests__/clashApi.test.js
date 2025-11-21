/**
 * Clash API Service Unit Tests
 * 
 * Tests the API service with caching functionality
 */

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiRemove: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock global fetch
global.fetch = jest.fn();

// Import after mocking
const { fetchPlayerData, clearCache, checkApiHealth } = require('../services/clashApi');

describe('Clash API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPlayerData', () => {
    it('should return error when player tag is empty', async () => {
      const result = await fetchPlayerData('');

      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error.message).toBe('Player tag is required');
      expect(result.cached).toBe(false);
    });

    it('should fetch player data from API successfully', async () => {
      const mockPlayerData = {
        tag: '#ABC123XYZ',
        name: 'TestPlayer',
        townHallLevel: 14,
        trophies: 5000,
      };

      mockAsyncStorage.getItem.mockResolvedValue(null); // No cache
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockPlayerData,
      });

      const result = await fetchPlayerData('#ABC123XYZ');

      expect(result.data).toEqual(mockPlayerData);
      expect(result.error).toBeNull();
      expect(result.cached).toBe(false);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/player?tag=%23ABC123XYZ'),
        expect.any(Object)
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should return cached data when available and valid', async () => {
      const mockPlayerData = {
        tag: '#ABC123XYZ',
        name: 'TestPlayer',
        townHallLevel: 14,
        trophies: 5000,
      };

      const cachedItem = {
        data: mockPlayerData,
        timestamp: Date.now() - 60000, // 1 minute ago
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(cachedItem));

      const result = await fetchPlayerData('#ABC123XYZ');

      expect(result.data).toEqual(mockPlayerData);
      expect(result.error).toBeNull();
      expect(result.cached).toBe(true);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should not use expired cache', async () => {
      const mockPlayerData = {
        tag: '#ABC123XYZ',
        name: 'TestPlayer',
        townHallLevel: 14,
        trophies: 5000,
      };

      const expiredCachedItem = {
        data: { name: 'OldData' },
        timestamp: Date.now() - (10 * 60 * 1000), // 10 minutes ago (expired)
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(expiredCachedItem));
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockPlayerData,
      });

      const result = await fetchPlayerData('#ABC123XYZ');

      expect(result.data).toEqual(mockPlayerData);
      expect(result.error).toBeNull();
      expect(result.cached).toBe(false);
      expect(mockAsyncStorage.removeItem).toHaveBeenCalled(); // Cache cleared
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should force refresh when requested', async () => {
      const mockPlayerData = {
        tag: '#ABC123XYZ',
        name: 'TestPlayer',
        townHallLevel: 14,
        trophies: 5000,
      };

      const cachedItem = {
        data: { name: 'CachedData' },
        timestamp: Date.now() - 60000, // Valid cache
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(cachedItem));
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockPlayerData,
      });

      const result = await fetchPlayerData('#ABC123XYZ', true); // Force refresh

      expect(result.data).toEqual(mockPlayerData);
      expect(result.error).toBeNull();
      expect(result.cached).toBe(false);
      expect(global.fetch).toHaveBeenCalled(); // Should call API despite cache
    });

    it('should handle API errors gracefully', async () => {
      const errorResponse = {
        error: 'Failed to fetch player data from Supercell.',
        details: 'Player not found',
      };

      mockAsyncStorage.getItem.mockResolvedValue(null);
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => errorResponse,
      });

      const result = await fetchPlayerData('#INVALID');

      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error.status).toBe(404);
      expect(result.error.message).toContain('Failed to fetch player data');
      expect(result.cached).toBe(false);
    });

    it('should handle network errors gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await fetchPlayerData('#ABC123XYZ');

      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('Network error');
      expect(result.cached).toBe(false);
    });

    it('should encode player tag correctly', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ tag: '#ABC123XYZ' }),
      });

      await fetchPlayerData('#ABC123XYZ');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('%23ABC123XYZ'),
        expect.any(Object)
      );
    });
  });

  describe('clearCache', () => {
    it('should clear all cached player data', async () => {
      const mockKeys = [
        'clash_api_cache_player_#ABC123',
        'clash_api_cache_player_#XYZ789',
        'some_other_key',
      ];

      mockAsyncStorage.getAllKeys.mockResolvedValue(mockKeys);

      await clearCache();

      expect(mockAsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        'clash_api_cache_player_#ABC123',
        'clash_api_cache_player_#XYZ789',
      ]);
    });

    it('should handle errors when clearing cache', async () => {
      mockAsyncStorage.getAllKeys.mockRejectedValue(new Error('Storage error'));

      // Should not throw
      await expect(clearCache()).resolves.toBeUndefined();
    });
  });

  describe('checkApiHealth', () => {
    it('should return available when API is reachable', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
      });

      const result = await checkApiHealth();

      expect(result.available).toBe(true);
      expect(result.error).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('stats-games-api-backend.vercel.app'),
        expect.any(Object)
      );
    });

    it('should return unavailable when API is not reachable', async () => {
      global.fetch.mockRejectedValue(new Error('Network timeout'));

      const result = await checkApiHealth();

      expect(result.available).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('Network timeout');
    });
  });
});
