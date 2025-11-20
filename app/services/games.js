import { supabase } from './supabase';

/**
 * Fetch all available games
 * @returns {Promise<{data: Array, error?: any}>}
 */
export const fetchGames = async () => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching games:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching games:', error);
    return { data: null, error };
  }
};

/**
 * Fetch user's linked games
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array, error?: any}>}
 */
export const fetchUserGames = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_games')
      .select(`
        id,
        game_id,
        installed_at,
        games:game_id (
          id,
          name,
          slug,
          icon_url
        )
      `)
      .eq('user_id', userId)
      .order('installed_at', { ascending: false });

    if (error) {
      console.error('Error fetching user games:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user games:', error);
    return { data: null, error };
  }
};

/**
 * Link a game to user's profile
 * @param {string} userId - The user ID
 * @param {string} gameId - The game ID
 * @returns {Promise<{data: object, error?: any}>}
 */
export const linkGameToUser = async (userId, gameId) => {
  try {
    const { data, error } = await supabase
      .from('user_games')
      .insert([
        {
          user_id: userId,
          game_id: gameId,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error linking game to user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error linking game to user:', error);
    return { data: null, error };
  }
};

/**
 * Unlink a game from user's profile
 * @param {string} userId - The user ID
 * @param {string} gameId - The game ID
 * @returns {Promise<{error?: any}>}
 */
export const unlinkGameFromUser = async (userId, gameId) => {
  try {
    const { error } = await supabase
      .from('user_games')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId);

    if (error) {
      console.error('Error unlinking game from user:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Error unlinking game from user:', error);
    return { error };
  }
};

/**
 * Check if a game is linked to user's profile
 * @param {string} userId - The user ID
 * @param {string} gameId - The game ID
 * @returns {Promise<{isLinked: boolean, error?: any}>}
 */
export const isGameLinked = async (userId, gameId) => {
  try {
    const { data, error } = await supabase
      .from('user_games')
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking if game is linked:', error);
      return { isLinked: false, error };
    }

    return { isLinked: !!data, error: null };
  } catch (error) {
    console.error('Error checking if game is linked:', error);
    return { isLinked: false, error };
  }
};
