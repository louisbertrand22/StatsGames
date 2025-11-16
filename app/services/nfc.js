import { supabase } from './supabase';

/**
 * Generate a random token for NFC sharing
 */
const generateToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Create a new NFC share token
 * @param {string} userId - The user ID
 * @param {number} ttlMinutes - Token time-to-live in minutes (default 15)
 * @returns {Promise<{token: string, url: string, expires_at: string, error?: any}>}
 */
export const createNFCToken = async (userId, ttlMinutes = 15) => {
  try {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    
    const { data, error } = await supabase
      .from('nfc_shares')
      .insert([
        {
          user_id: userId,
          token: token,
          expires_at: expiresAt.toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating NFC token:', error);
      return { token: null, url: null, expires_at: null, error };
    }

    // TODO: Replace with actual production URL when available
    const appUrl = process.env.EXPO_PUBLIC_APP_URL || 'https://statsgames.app';
    const url = `${appUrl}/nfc/${token}`;

    return {
      token: data.token,
      url: url,
      expires_at: data.expires_at,
      error: null,
    };
  } catch (error) {
    console.error('Error creating NFC token:', error);
    return { token: null, url: null, expires_at: null, error };
  }
};

/**
 * Get profile information by NFC token
 * @param {string} token - The NFC token
 * @returns {Promise<{user: object, stats: object, error?: any}>}
 */
export const getProfileByToken = async (token) => {
  try {
    // First, get the NFC share record and check if it's valid
    const { data: nfcShare, error: nfcError } = await supabase
      .from('nfc_shares')
      .select('user_id, expires_at')
      .eq('token', token)
      .single();

    if (nfcError || !nfcShare) {
      console.error('Error fetching NFC share:', nfcError);
      return { user: null, stats: null, error: nfcError || new Error('Token not found') };
    }

    // Check if token is expired
    if (new Date(nfcShare.expires_at) < new Date()) {
      return { user: null, stats: null, error: new Error('Token expired') };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', nfcShare.user_id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { user: null, stats: null, error: profileError };
    }

    // Get user's game stats (public stats only)
    const { data: gameStats, error: statsError } = await supabase
      .from('game_stats')
      .select(`
        game_id,
        stats,
        updated_at,
        games:game_id (
          name,
          slug,
          icon_url
        )
      `)
      .eq('user_id', nfcShare.user_id);

    if (statsError) {
      console.error('Error fetching game stats:', statsError);
      // Continue even if stats fail, we can still show the profile
    }

    return {
      user: {
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
      },
      stats: gameStats || [],
      error: null,
    };
  } catch (error) {
    console.error('Error getting profile by token:', error);
    return { user: null, stats: null, error };
  }
};

/**
 * Delete expired NFC tokens for a user
 * @param {string} userId - The user ID
 */
export const cleanupExpiredTokens = async (userId) => {
  try {
    const { error } = await supabase
      .from('nfc_shares')
      .delete()
      .eq('user_id', userId)
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error cleaning up expired tokens:', error);
    }
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
};
