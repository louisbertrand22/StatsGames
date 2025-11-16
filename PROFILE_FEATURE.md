# Profile Page Feature

## Overview
The profile page allows authenticated users to manage their account settings and personal information.

## Features

### 1. Username Update
- Users can set and change their display username
- Username is stored in the Supabase `profiles` table
- Profile is automatically created when users sign up
- Profile is auto-created on login for existing users (backward compatibility)
- Real-time validation ensures username is not empty
- Changes are reflected immediately after update

### 2. Password Change
- Secure password update functionality
- Requires new password and confirmation
- Minimum 6 characters validation
- Password is updated through Supabase Auth API

### 3. Profile Picture
- Users can select images from their device gallery
- Uses expo-image-picker for cross-platform compatibility
- Circular avatar display (80x80px)
- Falls back to user initial if no image is set
- Permission handling for photo library access

## Usage

### Accessing the Profile Page
1. Log in to the application
2. From the Home screen, tap the "Edit Profile" button
3. The Profile Settings screen will open

### Updating Username
1. Enter a new username in the username field
2. Tap "Update Username"
3. A success message will confirm the update

### Changing Password
1. Enter a new password (minimum 6 characters)
2. Re-enter the same password in the confirmation field
3. Tap "Update Password"
4. A success message will confirm the update

### Updating Profile Picture
1. Tap "Upload Photo" (or "Change Photo" if you have one set)
2. Grant permission to access photos when prompted
3. Select an image from your gallery
4. The image will be cropped to a square and displayed

## Technical Details

### Components
- **ProfileScreen.js**: Main profile management screen
- **AuthContext.js**: Handles profile creation and updates

### Profile Management
- **Profile Creation**: Automatically created during user signup
- **Backward Compatibility**: Auto-created on login if missing (for existing users)
- **Profile Structure**: Contains `id`, `username`, `avatar_url`, and `created_at` fields

### Context Methods
- `signUp(email, password)`: Creates user and profile automatically
- `fetchProfile(userId)`: Fetches profile or creates one if missing
- `updateUsername(newUsername)`: Updates username in profiles table
- `updatePassword(newPassword)`: Updates user password via Supabase Auth
- `updateProfilePicture(avatarUrl)`: Updates avatar URL in profiles table

### Dependencies
- expo-image-picker: For selecting images from device

### Navigation
- Route name: "Profile"
- Access: Available only to authenticated users
- Parent: HomeScreen

## Future Enhancements
- [ ] Upload profile pictures to Supabase Storage
- [ ] Add email change functionality
- [ ] Add account deletion option
- [ ] Add two-factor authentication settings
