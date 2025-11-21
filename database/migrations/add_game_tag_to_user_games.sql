-- Migration: Add game_tag field to user_games table
-- This allows users to store game-specific identifiers like Clash of Clans player tags
--
-- To run this migration:
-- 1. Log in to your Supabase dashboard at https://app.supabase.com
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this SQL
-- 4. Click "Run" to execute

-- Add game_tag column to user_games table
-- This column will store game-specific identifiers (e.g., Clash of Clans player tag)
ALTER TABLE public.user_games
ADD COLUMN IF NOT EXISTS game_tag TEXT;

-- Add comment to document the column
COMMENT ON COLUMN public.user_games.game_tag IS 'Game-specific identifier or tag (e.g., Clash of Clans player tag #ABC123)';
