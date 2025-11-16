# Testing Profile Page Fix

## Overview
This document describes how to test the profile page fix that ensures usernames are properly stored in the database.

## What Was Fixed
Previously, when users signed up, no profile record was created in the `profiles` table. This meant:
- Users couldn't set their username
- The profile page would fail when trying to update username
- `profile?.username` was always undefined

## Testing the Fix

### Test 1: New User Signup
**Purpose**: Verify that new users get a profile created automatically

**Steps**:
1. Launch the app
2. Create a new account using email/password signup
3. After successful signup, verify:
   - User is logged in
   - Navigate to Profile Settings (from Home screen)
   - The username field should be empty (not errored)
   - Enter a username and click "Update Username"
   - Success message should appear
   - Username should persist after logout/login

**Expected Result**: 
- Profile is created automatically on signup
- Username can be set and stored in database
- Username persists across sessions

### Test 2: Existing User Without Profile
**Purpose**: Verify that existing users (who signed up before the fix) get a profile created automatically

**Steps**:
1. Log in with an existing account that was created before this fix
2. Navigate to Profile Settings
3. Verify:
   - The screen loads without errors
   - Username field is empty
   - You can set a username
   - Username persists

**Expected Result**:
- Profile is auto-created on first login
- User can set and update username normally

### Test 3: Username Update
**Purpose**: Verify that username updates work correctly

**Steps**:
1. Log in to the app
2. Navigate to Profile Settings
3. Enter a new username
4. Click "Update Username"
5. Verify success message
6. Navigate away and back to Profile Settings
7. Verify username is still displayed

**Expected Result**:
- Username is saved to database
- Changes persist across navigation
- No errors occur

### Test 4: Profile Persistence
**Purpose**: Verify profile data persists across sessions

**Steps**:
1. Log in and set a username
2. Log out
3. Log in again
4. Navigate to Profile Settings
5. Verify username is still there

**Expected Result**:
- Username persists across logout/login
- Profile data is properly stored in Supabase

## Database Verification

You can also verify the fix directly in Supabase:

1. Go to your Supabase dashboard
2. Navigate to Table Editor > profiles
3. After a user signs up, you should see a new row with:
   - `id`: matching the user's auth.users id
   - `username`: NULL (until user sets it)
   - `avatar_url`: NULL
   - `created_at`: timestamp of creation

4. After user updates their username:
   - `username`: should show the chosen username

## Implementation Details

### Changes Made
1. **`signUp()` in AuthContext.js**:
   - Automatically creates a profile entry after successful signup
   - Profile is created with `username: null` and `avatar_url: null`

2. **`fetchProfile()` in AuthContext.js**:
   - Checks if profile exists when fetching
   - If no profile exists (error code PGRST116), creates one automatically
   - This handles existing users who signed up before the fix

### Error Handling
- If profile creation fails during signup, error is logged but doesn't throw
- User auth creation succeeds even if profile creation fails
- On next login, profile will be auto-created by `fetchProfile()`

## Rollback
If issues occur, you can rollback this change by reverting the commit. However, profiles created by this fix will remain in the database (which is safe).
