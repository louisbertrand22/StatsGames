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
        game_tag,
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
 * @param {string} gameTag - Optional game-specific tag/identifier
 * @returns {Promise<{data: object, error?: any}>}
 */
export const linkGameToUser = async (userId, gameId, gameTag = null) => {
  try {
    const { data, error } = await supabase
      .from('user_games')
      .insert([
        {
          user_id: userId,
          game_id: gameId,
          game_tag: gameTag,
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
 * Update game tag for a user's linked game
 * @param {string} userId - The user ID
 * @param {string} gameId - The game ID
 * @param {string} gameTag - The game-specific tag/identifier
 * @returns {Promise<{data: object, error?: any}>}
 */
export const updateGameTag = async (userId, gameId, gameTag) => {
  try {
    // Validate that gameTag is provided and not empty
    if (gameTag === null || gameTag === undefined) {
      return { 
        data: null, 
        error: { message: 'Game tag is required' } 
      };
    }

    const { data, error } = await supabase
      .from('user_games')
      .update({ game_tag: gameTag })
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .select()
      .single();

    if (error) {
      console.error('Error updating game tag:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating game tag:', error);
    return { data: null, error };
  }
};

