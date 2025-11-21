# Game Tag Registration Feature

## Overview

This document explains the game tag registration feature, which allows users to associate game-specific identifiers (like player tags) with their linked games.

## What's New

### Database Changes

A new `game_tag` column has been added to the `user_games` table to store game-specific identifiers.

**Migration Required:** Run the SQL script in `database/migrations/add_game_tag_to_user_games.sql` in your Supabase SQL Editor.

### Supported Games

The application now supports the following games:

1. **Clash of Clans** - Requires player tag registration
2. **Clash Royale**
3. **Rocket League**
4. **Fortnite**

### Features

#### Game Detail Screen

A new `GameDetailScreen` has been added that allows users to:

- View the link status of a game
- Add or remove games from their profile
- Enter and save game-specific tags (currently enabled for Clash of Clans)

#### Player Tag Registration (Clash of Clans)

For Clash of Clans, users can:

1. Navigate to the game's detail screen
2. Link the game to their profile if not already linked
3. Enter their Clash of Clans player tag (e.g., `#ABC123XYZ`)
4. Save the tag to their profile

The player tag is displayed in the Games list when available.

## User Flow

### Linking a Game and Adding a Tag

1. User navigates to **Games** screen from the home screen
2. User taps on **Clash of Clans** card
3. User taps **"Add to Profile"** button
4. User enters their Clash of Clans player tag in the input field
5. User taps **"Save Tag"** button
6. Tag is saved and associated with the user's linked game

### Updating a Tag

1. User navigates to **Games** screen
2. User taps on a linked game (showing the tag below the game name)
3. User modifies the tag in the input field
4. User taps **"Save Tag"** button
5. Tag is updated

### Unlinking a Game

1. User navigates to game detail screen
2. User taps **"Remove from Profile"** button
3. Game and associated tag are removed from user's profile

## Technical Details

### API Changes

#### Updated Functions

**`linkGameToUser(userId, gameId, gameTag)`**
- Added optional `gameTag` parameter
- Allows linking a game with an initial tag value

**`fetchUserGames(userId)`**
- Now retrieves the `game_tag` field
- Returns game tags along with other game information

#### New Functions

**`updateGameTag(userId, gameId, gameTag)`**
- Updates the game tag for an already linked game
- Returns the updated user game data

### UI Components

#### GamesScreen Updates

- Game cards are now clickable and navigate to `GameDetailScreen`
- Displays game tags when available (below the "Linked" badge)
- Removed inline add/remove buttons (moved to detail screen)
- Auto-refreshes when user returns from detail screen

#### New GameDetailScreen

Located at: `app/screens/GameDetailScreen.js`

**Props:**
- `route.params.game` - The game object passed from GamesScreen

**Features:**
- Gradient header with game icon and name
- Link status indicator
- Conditional player tag input (shown for Clash of Clans)
- Save tag button (enabled only when game is linked)
- Link/Unlink toggle button

### Navigation

Added `GameDetail` screen to the navigation stack:
- Route: `games/:gameId`
- Deep link support included

## Database Schema

### user_games Table

| Column       | Type        | Description                                    |
|--------------|-------------|------------------------------------------------|
| id           | uuid        | Primary key                                    |
| user_id      | uuid        | Foreign key to users table                     |
| game_id      | uuid        | Foreign key to games table                     |
| game_tag     | text        | Game-specific identifier (nullable)            |
| installed_at | timestamptz | Timestamp when game was linked                 |

## Setup Instructions

### 1. Run Database Migration

```sql
-- Run this in your Supabase SQL Editor
ALTER TABLE public.user_games
ADD COLUMN IF NOT EXISTS game_tag TEXT;
```

### 2. Seed Games Data

```sql
-- Run this in your Supabase SQL Editor
-- Copy contents from database/seeds/games.sql
INSERT INTO public.games (name, slug, icon_url)
VALUES 
  ('Clash of Clans', 'clash-of-clans', NULL),
  ('Clash Royale', 'clash-royale', NULL),
  ('Rocket League', 'rocket-league', NULL),
  ('Fortnite', 'fortnite', NULL)
ON CONFLICT (slug) DO NOTHING;
```

### 3. No Code Changes Required

The app automatically detects and displays the new games and tag functionality.

## Future Enhancements

Potential improvements for this feature:

1. **Tag Validation** - Add format validation for different game types
2. **API Integration** - Fetch player stats using the saved tags
3. **Multiple Tags** - Support multiple tags per game (e.g., different game modes)
4. **Tag History** - Track tag changes over time
5. **Tag Sharing** - Include tags in NFC profile sharing
6. **More Games** - Extend tag support to other games (e.g., Fortnite Epic ID)

## Testing

### Manual Testing Checklist

- [ ] Navigate to Games screen
- [ ] Tap on Clash of Clans
- [ ] Verify detail screen displays correctly
- [ ] Link the game to profile
- [ ] Enter a player tag
- [ ] Save the tag
- [ ] Navigate back to Games screen
- [ ] Verify tag is displayed under the game
- [ ] Tap on the game again
- [ ] Update the tag
- [ ] Verify updated tag is saved
- [ ] Unlink the game
- [ ] Verify game and tag are removed

### Automated Tests

All tests are located in `app/__tests__/games.test.js`:

- ✅ Fetch games including Clash of Clans
- ✅ Link games to user profile
- ✅ Link game with player tag
- ✅ Fetch user games with tags
- ✅ Update game tag
- ✅ Unlink games

Run tests with:
```bash
cd app
npm test
```

## Security Considerations

- ✅ Game tags are stored per user (RLS policies apply)
- ✅ Users can only view/edit their own game tags
- ✅ No SQL injection risks (parameterized queries)
- ✅ No sensitive data exposed in tags (player tags are public game identifiers)

## Known Limitations

1. **No Tag Validation** - Currently accepts any text input
2. **Single Tag Per Game** - Only one tag can be stored per game
3. **No API Integration** - Tags are stored but not used to fetch stats yet
4. **Manual Migration** - Database migration must be run manually in Supabase

## Troubleshooting

### Tag Not Saving

1. Check that the migration has been run in Supabase
2. Verify the game is linked to the user's profile
3. Check browser/app console for error messages
4. Verify RLS policies allow updates to user_games table

### Tag Not Displaying

1. Ensure the game is linked with a non-null tag value
2. Check that fetchUserGames includes the game_tag field
3. Verify the GamesScreen is re-rendering after returning from detail screen

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify database migration was successful
3. Ensure RLS policies are configured correctly
4. Review the implementation files listed in this document
