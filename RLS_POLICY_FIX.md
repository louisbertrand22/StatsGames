# RLS Policy Fix - Profile Creation Issue

## Problem Summary
The application was encountering the following error when users tried to sign up or when existing users logged in:

```
ERROR Error creating profile: {"code": "42501", "details": null, "hint": null, "message": "new row violates row-level security policy for table \"profiles\""}
```

## Root Cause
The `profiles` table in Supabase had Row-Level Security (RLS) enabled with the following policies:
- ✅ `user_can_view_own_profile` - Allows users to SELECT their own profile
- ✅ `user_can_edit_own_profile` - Allows users to UPDATE their own profile
- ❌ **MISSING**: No INSERT policy

Without an INSERT policy, the application code in `app/contexts/AuthContext.js` could not create new profile records, even though it attempted to:
1. During user signup (lines 90-98)
2. When fetching a non-existent profile (lines 56-66)

## Solution Implemented
Added an INSERT policy to the `profiles` table in `supabase.yml`:

```yaml
- name: user_can_insert_own_profile
  action: insert
  check: "auth.uid() = id"
```

This policy ensures that:
- Authenticated users can insert profile records
- Users can only insert their own profile (where the user's auth.uid() matches the profile's id)
- Security is maintained - users cannot create profiles for other users

## How to Apply This Fix

### Option 1: If you have a Supabase project already set up
1. Go to your Supabase dashboard
2. Navigate to Database → Policies
3. Select the `profiles` table
4. Click "New Policy"
5. Choose "Create a policy from scratch"
6. Configure the policy:
   - **Name**: `user_can_insert_own_profile`
   - **Action**: `INSERT`
   - **Target roles**: `authenticated`
   - **USING expression**: (leave empty for INSERT)
   - **WITH CHECK expression**: `auth.uid() = id`
7. Click "Review" and then "Save policy"

### Option 2: Using SQL (recommended)
Run this SQL command in your Supabase SQL Editor:

```sql
CREATE POLICY "user_can_insert_own_profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
```

### Option 3: If you're using the supabase.yml schema
The fix is already in the `supabase.yml` file. Apply it to your Supabase project using your deployment method.

## Verification
After applying the policy, test the following scenarios:

### Test 1: New User Signup
1. Open the app
2. Sign up with a new email and password
3. ✅ User should be created successfully
4. ✅ Profile should be created automatically
5. ✅ No error messages should appear

### Test 2: Existing User Login
1. Log in with an existing user that doesn't have a profile
2. ✅ Profile should be created automatically on first login
3. ✅ No error messages should appear

### Test 3: Profile Updates
1. Go to the Profile Settings screen
2. Update your username
3. ✅ Username should be saved successfully
4. ✅ Changes should persist after logging out and back in

## Complete RLS Policy Set
After the fix, the `profiles` table has these RLS policies:

| Policy Name | Action | Condition | Purpose |
|-------------|--------|-----------|---------|
| `user_can_view_own_profile` | SELECT | `auth.uid() = id` | Users can view their own profile |
| `user_can_insert_own_profile` | INSERT | `auth.uid() = id` | Users can create their own profile |
| `user_can_edit_own_profile` | UPDATE | `auth.uid() = id` | Users can update their own profile |

## Files Modified
1. **supabase.yml** - Added INSERT policy to profiles table
2. **PROFILE_FIX_SUMMARY.md** - Updated documentation to reflect all RLS policies
3. **RLS_POLICY_FIX.md** (this file) - Comprehensive fix documentation

## Security Considerations
✅ The INSERT policy maintains security by using `auth.uid() = id` check
✅ Users can only create profiles for themselves
✅ No risk of users creating profiles for other users
✅ Follows the principle of least privilege
✅ Consistent with existing SELECT and UPDATE policies

## Additional Notes
- This fix does NOT modify any application code
- The existing profile creation logic in `AuthContext.js` remains unchanged
- The fix is backward compatible - existing profiles are not affected
- The policy only enables the INSERT operations that the code was already attempting
