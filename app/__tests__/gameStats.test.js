/**
 * @jest-environment jsdom
 */
import { upsertGameStats, fetchGameStats, fetchUserGameStats, deleteGameStats } from '../services/gameStats';
import { supabase } from '../services/supabase';

// Mock the supabase client
jest.mock('../services/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('gameStats Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertGameStats', () => {
    it('should successfully upsert game stats', async () => {
      const mockStats = {
        name: 'TestPlayer',
        tag: '#ABC123',
        trophies: 5000,
        townHallLevel: 14,
      };

      const mockResponse = {
        data: {
          id: 'stat-1',
          user_id: 'user-1',
          game_id: 'game-1',
          stats: mockStats,
          updated_at: '2025-11-21T22:00:00Z',
        },
        error: null,
      };

      const mockSingle = jest.fn().mockResolvedValue(mockResponse);
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockUpsert = jest.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = jest.fn().mockReturnValue({ upsert: mockUpsert });

      supabase.from = mockFrom;

      const result = await upsertGameStats('user-1', 'game-1', mockStats);

      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data.stats).toEqual(mockStats);
      expect(mockFrom).toHaveBeenCalledWith('game_stats');
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-1',
          game_id: 'game-1',
          stats: mockStats,
        }),
        expect.objectContaining({
          onConflict: 'user_id,game_id',
        })
      );
    });

    it('should return error when required parameters are missing', async () => {
      const result = await upsertGameStats(null, 'game-1', {});
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('required');
      expect(result.data).toBeNull();
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error' };
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockUpsert = jest.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = jest.fn().mockReturnValue({ upsert: mockUpsert });

      supabase.from = mockFrom;

      const result = await upsertGameStats('user-1', 'game-1', { test: 'data' });

      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
    });
  });

  describe('fetchGameStats', () => {
    it('should successfully fetch game stats', async () => {
      const mockStats = {
        id: 'stat-1',
        user_id: 'user-1',
        game_id: 'game-1',
        stats: { trophies: 5000 },
        updated_at: '2025-11-21T22:00:00Z',
      };

      const mockResponse = {
        data: mockStats,
        error: null,
      };

      const mockSingle = jest.fn().mockResolvedValue(mockResponse);
      const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

      supabase.from = mockFrom;

      const result = await fetchGameStats('user-1', 'game-1');

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockStats);
      expect(mockFrom).toHaveBeenCalledWith('game_stats');
    });

    it('should return null data when stats not found', async () => {
      const mockResponse = {
        data: null,
        error: { code: 'PGRST116' }, // Not found error code
      };

      const mockSingle = jest.fn().mockResolvedValue(mockResponse);
      const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

      supabase.from = mockFrom;

      const result = await fetchGameStats('user-1', 'game-1');

      expect(result.error).toBeNull();
      expect(result.data).toBeNull();
    });

    it('should handle database errors', async () => {
      const mockError = { code: 'OTHER_ERROR', message: 'Database error' };
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

      supabase.from = mockFrom;

      const result = await fetchGameStats('user-1', 'game-1');

      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
    });
  });

  describe('fetchUserGameStats', () => {
    it('should successfully fetch all game stats for a user', async () => {
      const mockStatsArray = [
        {
          game_id: 'game-1',
          stats: { trophies: 5000 },
          updated_at: '2025-11-21T22:00:00Z',
          games: {
            id: 'game-1',
            name: 'Clash of Clans',
            slug: 'clash-of-clans',
            icon_url: null,
          },
        },
        {
          game_id: 'game-2',
          stats: { wins: 100 },
          updated_at: '2025-11-21T21:00:00Z',
          games: {
            id: 'game-2',
            name: 'Clash Royale',
            slug: 'clash-royale',
            icon_url: null,
          },
        },
      ];

      const mockResponse = {
        data: mockStatsArray,
        error: null,
      };

      const mockOrder = jest.fn().mockResolvedValue(mockResponse);
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

      supabase.from = mockFrom;

      const result = await fetchUserGameStats('user-1');

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockStatsArray);
      expect(result.data).toHaveLength(2);
      expect(mockFrom).toHaveBeenCalledWith('game_stats');
      expect(mockOrder).toHaveBeenCalledWith('updated_at', { ascending: false });
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error' };
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

      supabase.from = mockFrom;

      const result = await fetchUserGameStats('user-1');

      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
    });
  });

  describe('deleteGameStats', () => {
    it('should successfully delete game stats', async () => {
      const mockResponse = { error: null };

      const mockEq2 = jest.fn().mockResolvedValue(mockResponse);
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq1 });
      const mockFrom = jest.fn().mockReturnValue({ delete: mockDelete });

      supabase.from = mockFrom;

      const result = await deleteGameStats('user-1', 'game-1');

      expect(result.error).toBeNull();
      expect(mockFrom).toHaveBeenCalledWith('game_stats');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error' };
      const mockEq2 = jest.fn().mockResolvedValue({ error: mockError });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq1 });
      const mockFrom = jest.fn().mockReturnValue({ delete: mockDelete });

      supabase.from = mockFrom;

      const result = await deleteGameStats('user-1', 'game-1');

      expect(result.error).toBeDefined();
    });
  });
});
