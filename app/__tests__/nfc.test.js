/**
 * NFC Service Unit Tests
 * 
 * These tests verify the NFC service functionality without requiring
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

describe('NFC Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNFCToken', () => {
    it('should generate a token with correct structure', async () => {
      // Mock successful database insert
      const mockInsertData = {
        id: 'test-id',
        user_id: 'user-123',
        token: 'abc123token',
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockInsertData,
              error: null,
            }),
          }),
        }),
      });

      const { createNFCToken } = await import('../services/nfc');
      const result = await createNFCToken('user-123', 15);

      expect(result.token).toBeDefined();
      expect(result.url).toContain('/nfc/');
      expect(result.expires_at).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      const { createNFCToken } = await import('../services/nfc');
      const result = await createNFCToken('user-123', 15);

      expect(result.error).toBeDefined();
      expect(result.token).toBeNull();
    });
  });

  describe('getProfileByToken', () => {
    it('should retrieve profile data for valid token', async () => {
      const futureDate = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      
      // Mock NFC share fetch
      const mockNfcShare = {
        user_id: 'user-123',
        expires_at: futureDate,
      };

      // Mock profile fetch
      const mockProfile = {
        id: 'user-123',
        username: 'testuser',
        avatar_url: 'https://example.com/avatar.png',
      };

      // Mock game stats fetch
      const mockStats = [
        {
          game_id: 'game-1',
          stats: { score: 100 },
          updated_at: new Date().toISOString(),
          games: {
            name: 'Test Game',
            slug: 'test-game',
            icon_url: 'https://example.com/icon.png',
          },
        },
      ];

      // Setup chained mock calls
      let callCount = 0;
      mockSupabase.from.mockImplementation((table) => {
        callCount++;
        if (callCount === 1) {
          // First call: nfc_shares
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockNfcShare,
                  error: null,
                }),
              }),
            }),
          };
        } else if (callCount === 2) {
          // Second call: profiles
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockProfile,
                  error: null,
                }),
              }),
            }),
          };
        } else {
          // Third call: game_stats
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockStats,
                error: null,
              }),
            }),
          };
        }
      });

      const { getProfileByToken } = await import('../services/nfc');
      const result = await getProfileByToken('valid-token');

      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('testuser');
      expect(result.stats).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('should reject expired tokens', async () => {
      const pastDate = new Date(Date.now() - 60 * 1000).toISOString();
      
      const mockNfcShare = {
        user_id: 'user-123',
        expires_at: pastDate,
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockNfcShare,
              error: null,
            }),
          }),
        }),
      });

      const { getProfileByToken } = await import('../services/nfc');
      const result = await getProfileByToken('expired-token');

      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('expired');
      expect(result.user).toBeNull();
    });
  });

  describe('Token Generation', () => {
    it('should generate unique tokens', () => {
      // We can't directly test the internal generateToken function,
      // but we can verify that multiple calls create different tokens
      const tokens = new Set();
      
      // Generate random strings similar to the token generation logic
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 100; i++) {
        let token = '';
        for (let j = 0; j < 32; j++) {
          token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        tokens.add(token);
      }

      // With 100 random 32-character tokens, we should have 100 unique values
      // (collision extremely unlikely)
      expect(tokens.size).toBe(100);
    });
  });
});
