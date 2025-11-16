# NFC Profile Sharing Implementation

## Overview

This document describes the implementation of NFC profile sharing feature for the StatsGames mobile application. Users can share their profile and game statistics via NFC tags or shareable links with automatic token expiration.

## Features Implemented

### 1. Database Schema

**Table: `nfc_shares`**
- `id` (UUID): Primary key, auto-generated
- `user_id` (UUID): Foreign key to auth.users, cascades on delete
- `token` (TEXT): Unique sharing token (32 characters)
- `expires_at` (TIMESTAMPTZ): Token expiration timestamp
- `created_at` (TIMESTAMPTZ): Creation timestamp

**RLS Policies:**
- `public_read_active_tokens`: Public read access for tokens that haven't expired
- `user_can_create_own_token`: Users can create their own tokens
- `user_can_view_own_tokens`: Users can view their own tokens

### 2. Services

**File: `app/services/nfc.js`**

#### `createNFCToken(userId, ttlMinutes = 15)`
Creates a new NFC sharing token with specified TTL (default 15 minutes).

**Request:**
```javascript
const result = await createNFCToken(userId, 15);
```

**Response:**
```javascript
{
  token: "abc123...",
  url: "https://statsgames.app/nfc/abc123...",
  expires_at: "2024-01-01T12:15:00Z",
  error: null
}
```

#### `getProfileByToken(token)`
Retrieves user profile and statistics by NFC token.

**Request:**
```javascript
const result = await getProfileByToken(token);
```

**Response:**
```javascript
{
  user: {
    id: "...",
    username: "player123",
    avatar_url: "..."
  },
  stats: [
    {
      game_id: "...",
      stats: { ... },
      updated_at: "...",
      games: {
        name: "Game Name",
        slug: "game-slug",
        icon_url: "..."
      }
    }
  ],
  error: null
}
```

#### `cleanupExpiredTokens(userId)`
Deletes all expired tokens for a user.

### 3. Mobile Screens

#### NFCShareScreen
**File: `app/screens/NFCShareScreen.js`**

Features:
- Token generation with 15-minute TTL
- Real-time countdown timer showing remaining time
- NFC tag writing capability (NDEF URI record)
- Clipboard fallback for devices without NFC
- NFC availability detection
- Token information display

User Flow:
1. User taps "Generate Token" button
2. System creates a new token and displays it
3. User can either:
   - Write to NFC tag (if NFC supported)
   - Copy link to clipboard
4. Timer shows remaining time until expiration

#### NFCProfileScreen
**File: `app/screens/NFCProfileScreen.js`**

Features:
- Display shared user profile (username, avatar)
- Display user's game statistics
- Token validation (checks expiration)
- Error handling for invalid/expired tokens
- Public access (no authentication required)

User Flow:
1. User scans NFC tag or opens link
2. System validates token
3. If valid, displays profile and stats
4. If expired/invalid, shows error message

### 4. NFC Hooks

**File: `app/hooks/useNFC.js`**

#### `useNFCReader(onNFCUrl, enabled)`
Hook for reading NFC tags.

Features:
- NFC availability detection
- Tag reading with NDEF URI decoding
- Automatic cleanup on unmount

#### `useNFCDeepLink(onTokenReceived)`
Hook for handling deep links.

Features:
- Initial URL handling (app opened via link)
- Runtime URL handling (app already open)
- Token extraction from URLs

### 5. Deep Linking Configuration

**File: `app/app.config.js`**

Configured URL schemes:
- Web: `https://statsgames.app/nfc/{token}`
- App: `statsgames://nfc/{token}`

**Android Configuration:**
- Intent filters for HTTPS deep links
- Auto-verify enabled for app links
- Categories: BROWSABLE, DEFAULT

**iOS Configuration:**
- Associated domains for universal links

**Navigation Configuration:**
- Linking prefixes configured
- Route mapping for NFCProfile screen

### 6. Navigation

**File: `app/navigation/AppNavigator.js`**

Updates:
- Added NFCShare screen (authenticated route)
- Added NFCProfile screen (public route)
- Deep linking support with navigation ref
- Automatic navigation on NFC URL detection

**File: `app/screens/HomeScreen.js`**

Updates:
- Added "Share via NFC" action card
- Navigation button to NFCShare screen

## Dependencies Added

```json
{
  "react-native-nfc-manager": "^3.x.x",
  "expo-clipboard": "^6.x.x"
}
```

## Usage Guide

### For Users Sharing Their Profile

1. Navigate to Home screen
2. Tap "Share via NFC" card
3. Tap "Generate Token" button
4. Choose sharing method:
   - **NFC Tag**: Tap "Write to NFC Tag" and hold device near tag
   - **Link**: Tap "Copy Link" to copy URL to clipboard
5. Share the NFC tag or link with others
6. Token expires automatically after 15 minutes

### For Users Receiving a Profile

1. Method 1 - NFC Tag:
   - Hold device near NFC tag
   - App opens automatically showing shared profile

2. Method 2 - Link:
   - Open shared link in browser or tap notification
   - App opens automatically showing shared profile

## Security Considerations

### Token Security
- Tokens are randomly generated (32 characters, alphanumeric)
- Tokens expire after 15 minutes
- Expired tokens cannot be used to access profiles
- Each user can have multiple active tokens

### Data Privacy
- Only public data is shared via NFC tokens:
  - Username
  - Avatar URL
  - Public game statistics
- User ID is partially masked in display (first 8 chars only)
- No email or sensitive information is exposed

### RLS (Row Level Security)
- Public read access only for active (non-expired) tokens
- Users can only create tokens for themselves
- Token creation checks authenticated user ID

## Testing Guide

### Test Scenarios

#### Test 1: Device A (Android) Writer → Device B (Android) Reader
1. On Device A:
   - Login to app
   - Navigate to NFC Share
   - Generate token
   - Write to NFC tag
2. On Device B:
   - Enable NFC
   - Tap device to tag
   - Verify profile loads correctly

#### Test 2: Device A (iOS) Writer → Device B (Android) Reader
1. On Device A (iOS):
   - Login to app
   - Generate token
   - Write to NFC tag (requires NFC-enabled iPhone)
2. On Device B (Android):
   - Tap device to tag
   - Verify profile loads correctly

#### Test 3: NFC Disabled Fallback
1. On any device:
   - Disable NFC or use device without NFC
   - Navigate to NFC Share
   - Verify warning message appears
   - Generate token
   - Copy link using clipboard
   - Share link via other means (messaging, email)
   - Open link on another device
   - Verify profile loads

#### Test 4: Token Expiration
1. Generate token
2. Wait 15 minutes (or modify TTL for faster testing)
3. Try to access profile via expired token
4. Verify "Token expired" error message appears

#### Test 5: Deep Linking
1. Generate token and copy link
2. Close app completely
3. Open link in browser
4. Verify app opens to NFCProfile screen
5. Verify profile data displays correctly

## Platform-Specific Notes

### iOS
- Requires NFC-capable device (iPhone 7 or later)
- NFC reading requires Core NFC framework
- App must be in foreground for NFC reading
- Universal Links require proper domain association

### Android
- NFC widely supported on Android devices
- NFC can work in background with proper intent filters
- App Links require domain verification

## API Endpoints Summary

While this implementation uses Supabase client-side calls, the equivalent REST API would be:

### POST /nfc/create-token
**Request:**
```json
{
  "user_id": "auth.uid()"
}
```

**Response:**
```json
{
  "token": "abc123",
  "url": "https://statsgames.app/nfc/abc123",
  "expires_at": "2024-01-01T12:15:00Z"
}
```

### GET /nfc/:token
**Response:**
```json
{
  "user": {
    "id": "...",
    "username": "player123",
    "avatar_url": "..."
  },
  "stats": [...]
}
```

**Error Responses:**
- 404: Token not found
- 410: Token expired

## Future Enhancements

### Potential Improvements
1. **Token Management**
   - List all active tokens for a user
   - Manual token revocation
   - Custom TTL selection

2. **Analytics**
   - Track how many times a profile was viewed
   - Analytics on NFC vs link sharing

3. **Privacy Controls**
   - Toggle individual stats visibility
   - Private mode for profiles

4. **Enhanced Sharing**
   - QR code generation as alternative to NFC
   - Social media sharing buttons
   - Email/SMS sharing integration

5. **Notifications**
   - Notify user when their profile is viewed
   - Alert before token expiration

## Troubleshooting

### NFC Not Working
- **Issue**: NFC tag not detected
- **Solution**: 
  - Ensure NFC is enabled in device settings
  - Hold device steady near tag for 1-2 seconds
  - Try different position/angle

### Token Not Loading
- **Issue**: Profile doesn't load when opening link
- **Solution**:
  - Check internet connection
  - Verify token hasn't expired
  - Try copying and pasting the full URL

### Deep Link Not Opening App
- **Issue**: Link opens in browser instead of app
- **Solution**:
  - Ensure app is installed
  - On Android: Verify app links in system settings
  - On iOS: Check associated domains configuration

## Files Changed/Added

### New Files
- `app/services/nfc.js` - NFC service with token management
- `app/screens/NFCShareScreen.js` - Token generation and sharing UI
- `app/screens/NFCProfileScreen.js` - Shared profile display
- `app/hooks/useNFC.js` - NFC reading and deep linking hooks

### Modified Files
- `supabase.yml` - Added nfc_shares table definition
- `app/navigation/AppNavigator.js` - Added NFC routes and deep linking
- `app/screens/HomeScreen.js` - Added NFC Share button
- `app/app.config.js` - Added deep linking configuration
- `app/package.json` - Added new dependencies

## Conclusion

The NFC profile sharing feature is now fully implemented with:
- ✅ Database table with RLS policies
- ✅ Token generation with 15-minute TTL
- ✅ NFC writing capability
- ✅ Profile viewing via token
- ✅ Deep linking support
- ✅ Clipboard fallback
- ✅ Token expiration handling
- ✅ Comprehensive error handling

The implementation follows best practices for security, user experience, and code organization.
