# Authentication Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                          App Launch                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │    AuthContext Init    │
                    │  Check for Session     │
                    └────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
         ┌─────────────────┐      ┌─────────────────┐
         │  Session Found  │      │ No Session Found│
         │  (Logged In)    │      │ (Not Logged In) │
         └─────────────────┘      └─────────────────┘
                    │                         │
                    │                         ▼
                    │              ┌─────────────────────┐
                    │              │   LoginScreen       │
                    │              │  - Email/Password   │
                    │              │  - Magic Link       │
                    │              └─────────────────────┘
                    │                         │
                    │                         ▼
                    │              ┌─────────────────────┐
                    │              │ User Authentication │
                    │              │  (Supabase Auth)    │
                    │              └─────────────────────┘
                    │                         │
                    │              ┌──────────┴──────────┐
                    │              ▼                     ▼
                    │    ┌──────────────┐      ┌──────────────┐
                    │    │   Success    │      │    Error     │
                    │    │ Create/Login │      │ Show Alert   │
                    │    └──────────────┘      └──────────────┘
                    │              │
                    │              ▼
                    │    ┌──────────────────┐
                    │    │ Fetch Profile    │
                    │    │ from profiles    │
                    │    │ table            │
                    │    └──────────────────┘
                    │              │
                    └──────────────┴──────────────┐
                                                  ▼
                                      ┌─────────────────────┐
                                      │    HomeScreen       │
                                      │  - Show username    │
                                      │  - Show email       │
                                      │  - Sign Out button  │
                                      └─────────────────────┘
                                                  │
                                                  ▼
                                      ┌─────────────────────┐
                                      │   User Signs Out    │
                                      └─────────────────────┘
                                                  │
                                                  ▼
                                      ┌─────────────────────┐
                                      │   Back to Login     │
                                      └─────────────────────┘
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                              App.js                              │
│                      (Wrapped in AuthProvider)                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         AuthContext.js                           │
│                                                                  │
│  State:                          Methods:                       │
│  - user                          - signUp()                     │
│  - session                       - signIn()                     │
│  - profile                       - signOut()                    │
│  - loading                       - sendMagicLink()              │
│                                  - fetchProfile()               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AppNavigator.js                           │
│                                                                  │
│  if (loading) → Show Loading Indicator                          │
│  if (user) → Show Home Screen                                   │
│  if (!user) → Show Login Screen                                 │
└─────────────────────────────────────────────────────────────────┘
         │                                            │
         ▼                                            ▼
┌─────────────────┐                      ┌─────────────────────┐
│  LoginScreen    │                      │    HomeScreen       │
│                 │                      │                     │
│  - Email input  │                      │  - User info        │
│  - Password     │                      │  - Profile data     │
│  - Sign Up/In   │                      │  - Sign Out button  │
│  - Magic Link   │                      │                     │
│                 │                      │  Uses:              │
│  Uses:          │                      │  useAuth() hook     │
│  useAuth() hook │                      │                     │
└─────────────────┘                      └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        services/supabase.js                      │
│                                                                  │
│  - Supabase Client Configuration                                │
│  - AsyncStorage for session persistence                         │
│  - Auto token refresh                                           │
│  - Auth state listeners                                         │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Supabase Backend                           │
│                                                                  │
│  - Auth Server                                                   │
│  - Database (profiles table)                                     │
│  - Row Level Security                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Methods

### 1. Email/Password Sign Up
```
User enters email + password
   → AuthContext.signUp()
   → Supabase Auth API
   → Email verification sent (optional)
   → User created in auth.users
   → Trigger to create profile in profiles table
   → Return to app (may require verification)
```

### 2. Email/Password Sign In
```
User enters email + password
   → AuthContext.signIn()
   → Supabase Auth API
   → Validate credentials
   → Create session
   → Store in AsyncStorage
   → Fetch user profile
   → Navigate to HomeScreen
```

### 3. Magic Link
```
User enters email
   → AuthContext.sendMagicLink()
   → Supabase sends email with link
   → User clicks link
   → Opens app with session token
   → Session created automatically
   → Navigate to HomeScreen
```

### 4. Sign Out
```
User clicks Sign Out
   → AuthContext.signOut()
   → Clear session from Supabase
   → Clear AsyncStorage
   → Update auth state
   → Navigate to LoginScreen
```

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   UI Layer   │────▶│ Context Layer│────▶│Service Layer │
│              │     │              │     │              │
│ LoginScreen  │     │ AuthContext  │     │   Supabase   │
│ HomeScreen   │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       ▲                     │                     │
       │                     │                     ▼
       │                     │            ┌──────────────┐
       │                     │            │   Backend    │
       │                     │            │              │
       │                     │            │ - Auth       │
       │                     └───────────▶│ - Database   │
       │                                  │ - RLS        │
       └──────────────────────────────────└──────────────┘
                (User data + Profile)
```

## Security Layers

1. **Client Side (React Native)**
   - Input validation
   - Secure storage (AsyncStorage)
   - HTTPS only communication

2. **Supabase SDK**
   - Auto token refresh
   - Session management
   - Secure credential handling

3. **Backend (Supabase)**
   - Password hashing (bcrypt)
   - JWT tokens
   - Row Level Security
   - Email verification
   - Rate limiting

4. **Database**
   - RLS policies on profiles table
   - User-specific data access
   - Cascade deletes on user removal
