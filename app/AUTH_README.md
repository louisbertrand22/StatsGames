# Authentication Setup

This document describes the authentication implementation in the StatsGames mobile app.

## Features

- ✅ Email/Password Sign Up
- ✅ Email/Password Sign In
- ✅ Magic Link Authentication (passwordless)
- ✅ Auth State Management with React Context
- ✅ Protected Routes
- ✅ User Profile Fetching
- ✅ Automatic Session Persistence

## Configuration

### 1. Environment Variables

Create a `.env` file in the `/app` directory with your Supabase credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project settings:
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings > API
4. Copy the URL and anon/public key

### 2. Supabase Email Auth Setup

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Email provider
3. Configure email templates (optional)
4. Set up redirect URLs for magic link (optional)

### 3. Database Schema

The authentication system expects a `profiles` table in your Supabase database. This is defined in `/supabase.yml`:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## Architecture

### Components

- **AuthContext** (`/contexts/AuthContext.js`): Manages authentication state and provides auth methods
- **LoginScreen** (`/screens/LoginScreen.js`): UI for sign in/sign up and magic link
- **HomeScreen** (`/screens/HomeScreen.js`): Protected screen showing user info
- **AppNavigator** (`/navigation/AppNavigator.js`): Handles routing based on auth state

### Services

- **supabase.js** (`/services/supabase.js`): Supabase client configuration

### Auth Flow

1. User opens app → AuthContext initializes
2. If no session exists → Show LoginScreen
3. User signs in/up → Session created in Supabase
4. AuthContext detects session → Fetches user profile
5. User is redirected to HomeScreen (protected route)

## Usage

### Using Auth in Components

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, profile, signOut } = useAuth();
  
  return (
    <View>
      <Text>Welcome {profile?.username || user?.email}!</Text>
      <Button onPress={signOut} title="Sign Out" />
    </View>
  );
}
```

### Available Auth Methods

- `signUp(email, password)` - Create new account
- `signIn(email, password)` - Sign in with email/password
- `sendMagicLink(email)` - Send magic link for passwordless auth
- `signOut()` - Sign out current user

### Auth State

- `user` - Current user object from Supabase Auth
- `session` - Current session object
- `profile` - User profile from profiles table
- `loading` - Loading state for auth operations

## Testing

To test the authentication:

1. Start the app: `npm start`
2. Create a test account using the sign up form
3. Check your email for verification (if enabled in Supabase)
4. Try signing in with the credentials
5. Test the magic link feature
6. Verify that protected routes work correctly

## Security Notes

- Never commit `.env` files with real credentials
- Use `.env.example` as a template
- Enable Row Level Security (RLS) on all tables
- Validate all user inputs
- Use HTTPS in production
