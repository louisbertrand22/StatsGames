/**
 * Games Service Unit Tests
 * 
 * These tests verify the games service functionality without requiring
 * a live Supabase connection. They test the core logic and error handling.
 */

import { jest } from '@jest/globals';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(),
};

// Mock the supabase service
jest.mock('../services/supabase', () => ({
  supabase: mockSupabase,
}));

describe('Games Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchGames', () => {
    it('should fetch all games successfully', async () => {
      const mockGames = [
        {
          id: 'game-1',
          name: 'Test Game 1',
          slug: 'test-game-1',
          icon_url: 'https://example.com/icon1.png',
          created_at: new Date().toISOString(),
        },
        {
          id: 'game-2',
          name: 'Test Game 2',
          slug: 'test-game-2',
          icon_url: 'https://example.com/icon2.png',
          created_at: new Date().toISOString(),
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockGames,
            error: null,
          }),
        }),
      });

      const { fetchGames } = await import('../services/games');
      const result = await fetchGames();

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(2);
      expect(result.error).toBeNull();
    });

    it('should fetch and handle Rocket League, Fortnite, and Clash Royale', async () => {
      const mockGames = [
        {
          id: 'game-clash-royale',
          name: 'Clash Royale',
          slug: 'clash-royale',
          icon_url: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 'game-fortnite',
          name: 'Fortnite',
          slug: 'fortnite',
          icon_url: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 'game-rocket-league',
          name: 'Rocket League',
          slug: 'rocket-league',
          icon_url: null,
          created_at: new Date().toISOString(),
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockGames,
            error: null,
          }),
        }),
      });

      const { fetchGames } = await import('../services/games');
      const result = await fetchGames();

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(3);
      expect(result.error).toBeNull();
      
      // Verify each game has the required fields
      const gameNames = result.data.map(g => g.name);
      expect(gameNames).toContain('Rocket League');
      expect(gameNames).toContain('Fortnite');
      expect(gameNames).toContain('Clash Royale');
      
      // Verify all games have slugs
      result.data.forEach(game => {
        expect(game.slug).toBeDefined();
        expect(game.name).toBeDefined();
      });
    });

    it('should handle fetch errors gracefully', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      });

      const { fetchGames } = await import('../services/games');
      const result = await fetchGames();

      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
    });
  });

  describe('fetchUserGames', () => {
    it('should fetch user games successfully', async () => {
      const mockUserGames = [
        {
          id: 'ug-1',
          game_id: 'game-1',
          installed_at: new Date().toISOString(),
          games: {
            id: 'game-1',
            name: 'Test Game 1',
            slug: 'test-game-1',
            icon_url: 'https://example.com/icon1.png',
          },
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockUserGames,
              error: null,
            }),
          }),
        }),
      });

      const { fetchUserGames } = await import('../services/games');
      const result = await fetchUserGames('user-123');

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(1);
      expect(result.data[0].games.name).toBe('Test Game 1');
      expect(result.error).toBeNull();
    });
  });

  describe('linkGameToUser', () => {
    it('should link game to user successfully', async () => {
      const mockLinkData = {
        id: 'ug-1',
        user_id: 'user-123',
        game_id: 'game-1',
        installed_at: new Date().toISOString(),
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockLinkData,
              error: null,
            }),
          }),
        }),
      });

      const { linkGameToUser } = await import('../services/games');
      const result = await linkGameToUser('user-123', 'game-1');

      expect(result.data).toBeDefined();
      expect(result.data.user_id).toBe('user-123');
      expect(result.data.game_id).toBe('game-1');
      expect(result.error).toBeNull();
    });

    it('should link Rocket League, Fortnite, and Clash Royale to user', async () => {
      const games = [
        { id: 'game-rocket-league', name: 'Rocket League' },
        { id: 'game-fortnite', name: 'Fortnite' },
        { id: 'game-clash-royale', name: 'Clash Royale' },
      ];

      for (const game of games) {
        const mockLinkData = {
          id: `ug-${game.id}`,
          user_id: 'user-123',
          game_id: game.id,
          installed_at: new Date().toISOString(),
        };

        mockSupabase.from.mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockLinkData,
                error: null,
              }),
            }),
          }),
        });

        const { linkGameToUser } = await import('../services/games');
        const result = await linkGameToUser('user-123', game.id);

        expect(result.data).toBeDefined();
        expect(result.data.user_id).toBe('user-123');
        expect(result.data.game_id).toBe(game.id);
        expect(result.error).toBeNull();
      }
    });

    it('should handle duplicate link errors', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { 
                message: 'duplicate key value violates unique constraint',
                code: '23505',
              },
            }),
          }),
        }),
      });

      const { linkGameToUser } = await import('../services/games');
      const result = await linkGameToUser('user-123', 'game-1');

      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
    });
  });

  describe('unlinkGameFromUser', () => {
    it('should unlink game from user successfully', async () => {
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      const { unlinkGameFromUser } = await import('../services/games');
      const result = await unlinkGameFromUser('user-123', 'game-1');

      expect(result.error).toBeNull();
    });

    it('should handle delete errors gracefully', async () => {
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: { message: 'Delete failed' },
            }),
          }),
        }),
      });

      const { unlinkGameFromUser } = await import('../services/games');
      const result = await unlinkGameFromUser('user-123', 'game-1');

      expect(result.error).toBeDefined();
    });
  });
});
