# Game Stats Storage Implementation

This document describes the implementation of persistent storage for game statistics in the `game_stats` table.

## Overview

The application now stores game statistics persistently in the Supabase `game_stats` table. When player data is fetched from external APIs (like the Clash of Clans API), it is automatically saved to the database for future reference and NFC profile sharing.

## Database Schema

### `game_stats` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `user_id` | UUID | Foreign key to `auth.users` (CASCADE DELETE) |
| `game_id` | UUID | Foreign key to `games` table (CASCADE DELETE) |
| `stats` | JSONB | Game-specific statistics stored as JSON |
| `updated_at` | TIMESTAMPTZ | Timestamp when stats were last updated |

**Constraints:**
- Unique constraint on `(user_id, game_id)` - one stats entry per user-game pair
- Automatically updates `updated_at` timestamp on upsert

**Indexes:**
- `game_stats_user_id_idx` - Fast lookup by user
- `game_stats_game_id_idx` - Fast lookup by game
- `game_stats_updated_at_idx` - Ordered by last update (DESC)

**Row Level Security (RLS):**
- Users can only view, insert, update, and delete their own stats
- Enforced by policies checking `auth.uid() = user_id`

## Implementation

### 1. New Service: `gameStats.js`

**File:** `app/services/gameStats.js`

Provides functions for managing game statistics:

#### `upsertGameStats(userId, gameId, stats)`
Inserts or updates game statistics for a user-game pair.

**Parameters:**
- `userId` (string): The user's ID
- `gameId` (string): The game's ID
- `stats` (object): Statistics object to store (will be stored as JSONB)

**Returns:**
```javascript
{
  data: object|null,  // The created/updated record
  error: object|null  // Error object if failed
}
```

**Behavior:**
- Uses `upsert` with `onConflict: 'user_id,game_id'` to update existing records
- Automatically sets `updated_at` to current timestamp
- Validates that all required parameters are provided

#### `fetchGameStats(userId, gameId)`
Retrieves game statistics for a specific user-game pair.

**Returns:**
```javascript
{
  data: object|null,  // The stats record or null if not found
  error: object|null  // Error object if failed (null if just not found)
}
```

#### `fetchUserGameStats(userId)`
Retrieves all game statistics for a user, including game details.

**Returns:**
```javascript
{
  data: Array|null,   // Array of stats with joined game info
  error: object|null
}
```

**Response includes:**
- Game stats data
- Associated game information (name, slug, icon_url)
- Ordered by `updated_at` descending (most recent first)

#### `deleteGameStats(userId, gameId)`
Deletes game statistics for a user-game pair.

**Returns:**
```javascript
{
  error: object|null  // Error object if failed, null if successful
}
```

### 2. Integration with GameDetailScreen

**File:** `app/screens/GameDetailScreen.js`

The screen now automatically saves stats when player data is fetched:

#### Stats Storage on Load
When `loadPlayerData()` successfully fetches player data:
1. Data is displayed to the user
2. Stats are saved to database via `upsertGameStats()`
3. Errors are logged but don't affect user experience (silent failure)

```javascript
// After fetching player data
const { error: statsError } = await upsertGameStats(user.id, game.id, data);
if (statsError) {
  console.error('Error saving game stats to database:', statsError);
} else {
  console.log('Successfully saved game stats to database');
}
```

#### Stats Cleanup on Unlink
When a user unlinks a game:
1. Game is unlinked from user profile
2. Associated stats are deleted via `deleteGameStats()`
3. Deletion errors are logged but don't prevent unlinking

```javascript
// When unlinking a game
const { error: deleteStatsError } = await deleteGameStats(user.id, game.id);
if (deleteStatsError) {
  console.error('Error deleting game stats:', deleteStatsError);
}
```

### 3. NFC Profile Sharing Integration

**File:** `app/services/nfc.js`

The `getProfileByToken()` function already queries the `game_stats` table to include stats in shared profiles:

```javascript
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
```

When someone scans an NFC tag or opens a profile link, they see:
- User profile information
- All game stats stored in the database
- Associated game details

## Usage Flow

### For Clash of Clans (Current Implementation)

1. User links Clash of Clans to their profile
2. User enters their player tag
3. Player data is fetched from the backend API
4. **Stats are automatically saved to `game_stats` table**
5. Stats are displayed on screen
6. Stats are available for NFC profile sharing
7. Stats can be refreshed (refetches and updates database)
8. If game is unlinked, stats are deleted from database

### Future Game Support

The implementation is generic and works for any game:

1. Fetch game data from any API
2. Call `upsertGameStats(userId, gameId, statsObject)`
3. Stats are stored and available for:
   - Display in the app
   - NFC profile sharing
   - Future analytics/dashboards

## Database Setup

### Migration File

**File:** `database/migrations/create_game_stats_table.sql`

To set up the `game_stats` table:

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Navigate to **SQL Editor**
3. Copy the contents of `database/migrations/create_game_stats_table.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

The migration:
- Creates the `game_stats` table with proper schema
- Sets up foreign key constraints
- Creates indexes for performance
- Enables RLS (Row Level Security)
- Creates policies for secure access

## Testing

### Automated Tests

**File:** `app/__tests__/gameStats.test.js`

Comprehensive test suite covering:
- ✅ Successful upsert of game stats
- ✅ Validation of required parameters
- ✅ Error handling for database errors
- ✅ Fetching stats for a user-game pair
- ✅ Handling "not found" cases
- ✅ Fetching all stats for a user
- ✅ Deleting stats
- ✅ Error scenarios

To run tests:
```bash
cd app
npm test gameStats.test.js
```

### Manual Testing

1. **Save Stats:**
   - Link Clash of Clans
   - Enter player tag and save
   - Verify stats appear on screen
   - Check Supabase dashboard - stats should be in `game_stats` table

2. **Update Stats:**
   - Click "Refresh" button
   - Verify stats update
   - Check `updated_at` timestamp in database

3. **NFC Sharing:**
   - Create NFC share link
   - Open link (or scan with another device)
   - Verify stats are included in shared profile

4. **Delete Stats:**
   - Unlink a game
   - Check database - stats should be deleted

## Example Stats Structure

### Clash of Clans
```json
{
  "name": "PlayerName",
  "tag": "#ABC123XYZ",
  "townHallLevel": 14,
  "trophies": 5000,
  "expLevel": 180,
  "clan": {
    "name": "ClanName",
    "tag": "#CLAN123"
  }
}
```

### Future Games
Any JSON structure can be stored. Examples:

**Clash Royale:**
```json
{
  "name": "Player",
  "tag": "#123ABC",
  "trophies": 6500,
  "bestTrophies": 7200,
  "wins": 1500,
  "losses": 1000
}
```

**Fortnite:**
```json
{
  "username": "Player123",
  "level": 250,
  "wins": 120,
  "kills": 3500,
  "kd_ratio": 2.5
}
```

## Benefits

1. **Persistence:** Stats survive app restarts and cache clears
2. **Sharing:** Stats are included in NFC profile sharing
3. **History:** `updated_at` timestamp tracks when stats were last refreshed
4. **Offline Access:** Stats available even when APIs are down
5. **Scalability:** Generic design supports any game with any stat structure
6. **Security:** RLS ensures users can only access their own stats

## Future Enhancements

Possible improvements:

1. **Stats History:** Track historical stats over time
2. **Analytics Dashboard:** Display trends and progress
3. **Leaderboards:** Compare stats with other users
4. **Achievements:** Award badges based on stats
5. **Export:** Allow users to download their stats
6. **Public Profiles:** Option to make stats publicly viewable

## Security Considerations

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own stats
- ✅ Foreign key constraints prevent orphaned records
- ✅ CASCADE DELETE ensures cleanup when users/games are deleted
- ✅ Input validation in service functions
- ✅ No sensitive data exposed in stats JSON

## Conclusion

The game stats storage implementation provides a robust, scalable foundation for storing and sharing game statistics. The generic design allows easy extension to any game while maintaining security and performance.
