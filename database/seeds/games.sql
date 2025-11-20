-- Seed data for games table
-- This file adds Rocket League, Fortnite, and Clash Royale to the games table

-- Insert Rocket League
INSERT INTO public.games (name, slug, icon_url)
VALUES (
  'Rocket League',
  'rocket-league',
  'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/252950/0a3a6e32594c9e93a5ca6437147c7836b4c0e73f.jpg'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Fortnite
INSERT INTO public.games (name, slug, icon_url)
VALUES (
  'Fortnite',
  'fortnite',
  'https://cdn2.unrealengine.com/Diesel%2Fproductv2%2Ffortnite%2Fhome%2FF_FortniteMainPromo_2560x1440-2560x1440-f2e7c6c3e5d6f5b5f5c1c5d5a5f5c5a5.jpg'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Clash Royale
INSERT INTO public.games (name, slug, icon_url)
VALUES (
  'Clash Royale',
  'clash-royale',
  'https://play-lh.googleusercontent.com/hB3mZJwn7qZBXyVPg2dKg-TadVPXUjqpJqXLm7HvX4qVH-pWVpNqh5N6tN1qX5nqZQ'
)
ON CONFLICT (slug) DO NOTHING;
