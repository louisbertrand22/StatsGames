-- Seed data for games table
-- This file adds Rocket League, Fortnite, and Clash Royale to the games table
--
-- NOTE: The icon_url fields are set to NULL. You should update these with actual
-- icon URLs from the respective game publishers or verified CDNs after running this script.
-- The app will display placeholder icons for games without icon URLs.

-- Insert Rocket League
INSERT INTO public.games (name, slug, icon_url)
VALUES (
  'Rocket League',
  'rocket-league',
  NULL
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Fortnite
INSERT INTO public.games (name, slug, icon_url)
VALUES (
  'Fortnite',
  'fortnite',
  NULL
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Clash Royale
INSERT INTO public.games (name, slug, icon_url)
VALUES (
  'Clash Royale',
  'clash-royale',
  NULL
)
ON CONFLICT (slug) DO NOTHING;
