-- Migration: Create game_stats table
-- This table stores game statistics for each user-game pair
--
-- To run this migration:
-- 1. Log in to your Supabase dashboard at https://app.supabase.com
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this SQL
-- 4. Click "Run" to execute

-- Create game_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.game_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- Add comment to document the table
COMMENT ON TABLE public.game_stats IS 'Stores game statistics for each user-game combination';

-- Add column comments
COMMENT ON COLUMN public.game_stats.id IS 'Primary key (UUID)';
COMMENT ON COLUMN public.game_stats.user_id IS 'Foreign key to auth.users';
COMMENT ON COLUMN public.game_stats.game_id IS 'Foreign key to games table';
COMMENT ON COLUMN public.game_stats.stats IS 'JSON object containing game-specific statistics';
COMMENT ON COLUMN public.game_stats.updated_at IS 'Timestamp when stats were last updated';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS game_stats_user_id_idx ON public.game_stats(user_id);
CREATE INDEX IF NOT EXISTS game_stats_game_id_idx ON public.game_stats(game_id);
CREATE INDEX IF NOT EXISTS game_stats_updated_at_idx ON public.game_stats(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_stats table

-- Policy: Users can view their own game stats
CREATE POLICY "Users can view own game stats"
  ON public.game_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own game stats
CREATE POLICY "Users can insert own game stats"
  ON public.game_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own game stats
CREATE POLICY "Users can update own game stats"
  ON public.game_stats
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own game stats
CREATE POLICY "Users can delete own game stats"
  ON public.game_stats
  FOR DELETE
  USING (auth.uid() = user_id);
