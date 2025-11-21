import { supabase } from './supabase';

/**
 * Store or update game statistics for a user
 * @param {string} userId - The user ID
 * @param {string} gameId - The game ID
 * @param {object} stats - The statistics object to store (will be stored as JSONB)
 * @returns {Promise<{data: object, error?: any}>}
 */
export const upsertGameStats = async (userId, gameId, stats) => {
  try {
    // Validate inputs
    if (!userId || !gameId || !stats) {
      return {
        data: null,
        error: { message: 'userId, gameId, and stats are required' }
      };
    }

    const { data, error } = await supabase
      .from('game_stats')
      .upsert(
        {
          user_id: userId,
          game_id: gameId,
          stats: stats,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,game_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting game stats:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error upserting game stats:', error);
    return { data: null, error };
  }
};

/**
 * Fetch game statistics for a user and game
 * @param {string} userId - The user ID
 * @param {string} gameId - The game ID
 * @returns {Promise<{data: object, error?: any}>}
 */
export const fetchGameStats = async (userId, gameId) => {
  try {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single();

    if (error) {
      // Not found is not an error in this context
      if (error.code === 'PGRST116') {
        return { data: null, error: null };
      }
      console.error('Error fetching game stats:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return { data: null, error };
  }
};

/**
 * Fetch all game statistics for a user
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array, error?: any}>}
 */
export const fetchUserGameStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('game_stats')
      .select(`
        game_id,
        stats,
        updated_at,
        games:game_id (
          id,
          name,
          slug,
          icon_url
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching user game stats:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user game stats:', error);
    return { data: null, error };
  }
};

/**
 * Delete game statistics for a user and game
 * @param {string} userId - The user ID
 * @param {string} gameId - The game ID
 * @returns {Promise<{error?: any}>}
 */
export const deleteGameStats = async (userId, gameId) => {
  try {
    const { error } = await supabase
      .from('game_stats')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId);

    if (error) {
      console.error('Error deleting game stats:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting game stats:', error);
    return { error };
  }
};
