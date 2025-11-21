# Games Setup Guide

This guide explains how to add games to the StatsGames application.

## Overview

The StatsGames application supports multiple games. Users can link games to their profile and share their stats. The games are stored in the `games` table in the Supabase database.

## Currently Supported Games

The following games are now supported:
- **Clash of Clans** (slug: `clash-of-clans`) - Supports player tag registration
- **Clash Royale** (slug: `clash-royale`)
- **Rocket League** (slug: `rocket-league`)
- **Fortnite** (slug: `fortnite`)

**Note:** The initial seed file sets icon URLs to NULL. The app will display placeholder icons (showing the first letter of the game name) for games without icon URLs. You can update the icon URLs later using the Supabase Table Editor or by running an UPDATE SQL statement.

## Adding Games to the Database

### Method 1: Using Supabase SQL Editor (Recommended)

1. Log in to your Supabase project at https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Copy the contents of `database/seeds/games.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute the SQL

The SQL script will insert all four games (Clash of Clans, Clash Royale, Rocket League, and Fortnite) into the games table. The `ON CONFLICT (slug) DO NOTHING` clause ensures that running the script multiple times won't create duplicates.

### Method 2: Using Supabase API

You can also add games programmatically using the Supabase JavaScript client:

```javascript
import { supabase } from './services/supabase';

const addGames = async () => {
  const games = [
    {
      name: 'Clash of Clans',
      slug: 'clash-of-clans',
      icon_url: 'https://cdn.supercell.com/...',
    },
    {
      name: 'Clash Royale',
      slug: 'clash-royale',
      icon_url: 'https://play-lh.googleusercontent.com/...',
    },
    {
      name: 'Rocket League',
      slug: 'rocket-league',
      icon_url: 'https://cdn.cloudflare.steamstatic.com/...',
    },
    {
      name: 'Fortnite',
      slug: 'fortnite',
      icon_url: 'https://cdn2.unrealengine.com/...',
    },
  ];

  const { data, error } = await supabase
    .from('games')
    .upsert(games, { onConflict: 'slug' });

  if (error) {
    console.error('Error adding games:', error);
  } else {
    console.log('Games added successfully:', data);
  }
};
```

## Database Schema

The `games` table has the following structure:

| Column      | Type         | Description                           |
|-------------|--------------|---------------------------------------|
| id          | uuid         | Primary key (auto-generated)          |
| name        | text         | Display name of the game              |
| slug        | text         | URL-friendly unique identifier        |
| icon_url    | text         | URL to the game's icon/logo           |
| created_at  | timestamptz  | Timestamp when the game was added     |

## How Games Work in the App

1. **Games Screen**: Users can view all available games in the Games screen (`app/screens/GamesScreen.js`)
2. **Linking Games**: Users can link games to their profile by tapping the "Add" button
3. **User Games**: Linked games are stored in the `user_games` table
4. **Profile Sharing**: When users share their profile via NFC, their linked games are included

## Adding More Games

To add additional games beyond the three included:

1. Follow the same SQL pattern in `database/seeds/games.sql`
2. Ensure each game has a unique `slug`
3. Provide a valid `icon_url` for the game's icon
4. Run the SQL in your Supabase project

Example:
```sql
INSERT INTO public.games (name, slug, icon_url)
VALUES (
  'Your Game Name',
  'your-game-slug',
  'https://example.com/icon.png'
)
ON CONFLICT (slug) DO NOTHING;
```

## Verifying Games Are Added

After running the seed SQL, you can verify the games were added:

1. In Supabase Dashboard:
   - Go to **Table Editor** > **games**
   - You should see all three games listed

2. In the App:
   - Open the app and navigate to the Games screen
   - You should see Clash of Clans, Clash Royale, Rocket League, and Fortnite listed
   - You can link/unlink these games from your profile
   - For Clash of Clans, you can also register your player tag by tapping on the game

## Notes

- The `icon_url` field is optional but recommended for better UI experience
- If `icon_url` is NULL, the app displays a placeholder icon with the first letter of the game name
- Game slugs must be unique and URL-friendly (lowercase, hyphens instead of spaces)
- The existing app code requires no changes to support these new games
- All game management is done through the database

## Updating Icon URLs

If you want to add proper icon URLs to the games after seeding, you can update them using SQL:

```sql
-- Update Rocket League icon
UPDATE public.games
SET icon_url = 'https://your-cdn.com/rocket-league-icon.png'
WHERE slug = 'rocket-league';

-- Update Fortnite icon
UPDATE public.games
SET icon_url = 'https://your-cdn.com/fortnite-icon.png'
WHERE slug = 'fortnite';

-- Update Clash Royale icon
UPDATE public.games
SET icon_url = 'https://your-cdn.com/clash-royale-icon.png'
WHERE slug = 'clash-royale';
```

Or use the Supabase Table Editor:
1. Navigate to **Table Editor** > **games**
2. Click on the row you want to edit
3. Update the `icon_url` field
4. Save the changes
