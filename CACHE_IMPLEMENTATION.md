# Backend API Caching Implementation

This document describes the caching implementation for the backend API calls.

## Overview

The application now includes a caching layer for calls to the Vercel backend API (`https://stats-games-api-backend.vercel.app/`). This reduces API calls to Supercell's API and improves performance by caching player data locally.

## Features

### 1. Clash API Service (`app/services/clashApi.js`)

The service provides the following functions:

#### `fetchPlayerData(playerTag, forceRefresh = false)`
Fetches player data from the backend API with intelligent caching.

**Parameters:**
- `playerTag` (string): The player tag (e.g., `#ABC123XYZ`)
- `forceRefresh` (boolean): If `true`, bypasses cache and fetches fresh data

**Returns:**
```javascript
{
  data: object|null,     // Player data or null if error
  error: object|null,    // Error object or null if success
  cached: boolean        // True if data was served from cache
}
```

**Caching Behavior:**
- Player data is cached for 5 minutes (configurable via `CACHE_TTL`)
- Cache is automatically cleared when expired
- Each player tag has its own cache entry
- Cache key format: `clash_api_cache_player_<playerTag>`

#### `clearCache()`
Clears all cached player data.

**Usage:**
```javascript
await clearCache();
```

#### `checkApiHealth()`
Checks if the backend API is available.

**Returns:**
```javascript
{
  available: boolean,    // True if API is reachable
  error: object|null     // Error details if unavailable
}
```

### 2. GameDetailScreen Integration

The `GameDetailScreen` has been enhanced to display player stats for Clash of Clans:

**Features:**
- Automatic loading of player stats when a player tag is saved
- Manual refresh button to get latest data
- Loading states with activity indicators
- Error handling with retry functionality
- Cache indicators in console logs

**Displayed Stats:**
- Player name
- Player tag
- Town Hall level
- Trophies
- Experience level
- Clan name (if player is in a clan)

## Usage Example

### Linking Clash of Clans and Viewing Stats

1. Navigate to the Games screen
2. Select "Clash of Clans"
3. Link the game to your profile
4. Enter your player tag (e.g., `#ABC123XYZ`)
5. Click "Save Tag"
6. Player stats will automatically load and display
7. Use the "Refresh" button to manually reload stats

### Programmatic Usage

```javascript
import { fetchPlayerData, clearCache } from '../services/clashApi';

// Fetch player data (will use cache if available)
const { data, error, cached } = await fetchPlayerData('#ABC123XYZ');

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Player:', data.name);
  console.log('From cache:', cached);
}

// Force refresh (bypass cache)
const fresh = await fetchPlayerData('#ABC123XYZ', true);

// Clear all cache
await clearCache();
```

## Configuration

### Cache TTL
The cache time-to-live can be configured in `app/services/clashApi.js`:

```javascript
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
```

### API Base URL
The backend API URL is configured in `app/services/clashApi.js`:

```javascript
const API_BASE_URL = 'https://stats-games-api-backend.vercel.app';
```

## Error Handling

The service handles various error scenarios:

1. **Empty player tag**: Returns validation error
2. **Network errors**: Returns error with message details
3. **API errors (404, 500, etc.)**: Returns HTTP status and error details
4. **Cache errors**: Logged to console but doesn't block functionality

## Testing

Comprehensive tests are available in `app/__tests__/clashApi.test.js`:

- Player data fetching
- Cache validation and expiration
- Force refresh functionality
- Error handling
- API health checks

Run tests:
```bash
cd app
npm test clashApi.test.js
```

## Architecture

```
┌─────────────────────┐
│  GameDetailScreen   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    clashApi.js      │
│  - fetchPlayerData  │
│  - clearCache       │
│  - checkApiHealth   │
└──────────┬──────────┘
           │
           ├────────────┐
           ▼            ▼
  ┌────────────┐  ┌──────────┐
  │ AsyncStorage│  │  Backend │
  │   (Cache)   │  │   API    │
  └────────────┘  └──────────┘
                      │
                      ▼
               ┌──────────────┐
               │  Supercell   │
               │     API      │
               └──────────────┘
```

## Performance Benefits

1. **Reduced API Calls**: Player data is cached for 5 minutes, reducing calls to Supercell API
2. **Faster Load Times**: Cached data is served instantly from local storage
3. **Bandwidth Savings**: Less network traffic when viewing same player multiple times
4. **Improved UX**: Instant display of cached data with option to manually refresh

## Future Enhancements

Potential improvements:
1. Add cache for other games (Clash Royale, Fortnite, etc.)
2. Implement background refresh for frequently viewed players
3. Add cache statistics and management UI
4. Support for batch player data fetching
5. Implement cache size limits and LRU eviction policy
