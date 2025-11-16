# NFC Profile Sharing - Manual Testing Checklist

## Pre-Test Setup

### Required Devices
- [ ] Android device with NFC (for writer testing)
- [ ] Android device with NFC (for reader testing)
- [ ] iOS device with NFC (optional, for cross-platform testing)
- [ ] NFC tag (NDEF compatible)

### App Setup
- [ ] Build and install app on test devices
- [ ] Ensure Supabase backend is running
- [ ] Create test user account(s)
- [ ] Add test profile data (username, avatar)
- [ ] Enable NFC on test devices

## Test Cases

### Test 1: Token Generation

**Objective:** Verify token generation works correctly

**Steps:**
1. [ ] Launch app and login
2. [ ] Navigate to Home screen
3. [ ] Tap "Share via NFC" card
4. [ ] Tap "Generate Token" button

**Expected Results:**
- [ ] Token is generated successfully
- [ ] Token value is displayed (32 characters)
- [ ] URL is shown with format: `https://statsgames.app/nfc/{token}`
- [ ] Expiration time shows "15:00" (15 minutes)
- [ ] Timer starts counting down
- [ ] No errors are displayed

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 2: NFC Writing (Android to NFC Tag)

**Objective:** Verify NFC tag writing functionality

**Prerequisites:**
- [ ] Token generated from Test 1
- [ ] NFC tag available
- [ ] NFC enabled on device

**Steps:**
1. [ ] After generating token, tap "Write to NFC Tag"
2. [ ] Hold device near NFC tag
3. [ ] Wait for write confirmation

**Expected Results:**
- [ ] "Tap device to NFC tag..." message appears
- [ ] Success alert shows "Profile link written to NFC tag!"
- [ ] No errors occur during write operation

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 3: NFC Reading (Android from NFC Tag)

**Objective:** Verify NFC tag reading and profile display

**Prerequisites:**
- [ ] NFC tag written from Test 2
- [ ] Second Android device with app installed
- [ ] NFC enabled on reader device

**Steps:**
1. [ ] Close app on reader device (or open to any screen)
2. [ ] Hold reader device near NFC tag
3. [ ] Observe app behavior

**Expected Results:**
- [ ] App opens automatically
- [ ] NFCProfile screen is displayed
- [ ] Profile information loads correctly:
  - [ ] Username is displayed
  - [ ] Avatar is shown (if set)
  - [ ] User ID shows (first 8 chars)
- [ ] Game statistics are displayed (if available)
- [ ] "Shared Profile" header is visible
- [ ] No errors or loading issues

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 4: Link Sharing (Copy to Clipboard)

**Objective:** Verify clipboard sharing fallback

**Steps:**
1. [ ] Generate new token
2. [ ] Tap "Copy Link" button
3. [ ] Observe confirmation
4. [ ] Paste link in notes app or browser

**Expected Results:**
- [ ] "Link copied to clipboard!" alert appears
- [ ] Link format is correct: `https://statsgames.app/nfc/{token}`
- [ ] Link can be pasted successfully
- [ ] Link is complete and not truncated

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 5: Deep Link Opening

**Objective:** Verify deep link navigation works

**Prerequisites:**
- [ ] Link copied from Test 4
- [ ] App installed on device

**Steps:**
1. [ ] Close app completely
2. [ ] Paste link in messaging app or browser
3. [ ] Tap the link
4. [ ] Observe app behavior

**Expected Results:**
- [ ] App opens automatically
- [ ] NFCProfile screen is displayed with correct profile
- [ ] Profile data loads successfully
- [ ] Navigation works as expected

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 6: Token Expiration

**Objective:** Verify token expiration mechanism

**Setup Options:**
- Option A: Wait 15 minutes (slow but realistic)
- Option B: Modify TTL to 1 minute in code for faster testing

**Steps:**
1. [ ] Generate token
2. [ ] Note the expiration time
3. [ ] Wait for token to expire
4. [ ] Try to access profile using expired token

**Expected Results:**
- [ ] Timer counts down to 0:00
- [ ] After expiration, timer shows "Expired"
- [ ] Attempting to access expired token shows error
- [ ] Error message: "This sharing link has expired"
- [ ] Helpful message suggests generating new token

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 7: NFC Not Supported Fallback

**Objective:** Verify graceful handling when NFC is unavailable

**Test Devices:**
- [ ] Device without NFC support, OR
- [ ] Disable NFC in device settings

**Steps:**
1. [ ] Open app on device without NFC (or with NFC disabled)
2. [ ] Navigate to NFC Share screen
3. [ ] Observe warning messages
4. [ ] Try to generate token

**Expected Results:**
- [ ] Warning banner displays: "⚠️ NFC is not supported..." or "⚠️ NFC is disabled..."
- [ ] Token generation still works
- [ ] "Write to NFC Tag" button is either hidden or disabled
- [ ] "Copy Link" button remains available
- [ ] User can still share via link

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 8: Multiple Token Generation

**Objective:** Verify multiple tokens can be created

**Steps:**
1. [ ] Generate first token (Token A)
2. [ ] Note the token value
3. [ ] Tap "Generate New Token"
4. [ ] Note the second token value (Token B)

**Expected Results:**
- [ ] Token B is different from Token A
- [ ] Both tokens are valid simultaneously
- [ ] Old token (A) still works until it expires
- [ ] New token (B) works immediately
- [ ] UI updates to show new token
- [ ] Timer resets to 15:00 for new token

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 9: Invalid Token Handling

**Objective:** Verify error handling for invalid tokens

**Steps:**
1. [ ] Manually construct invalid URL: `https://statsgames.app/nfc/invalid123`
2. [ ] Open the link
3. [ ] Observe error handling

**Expected Results:**
- [ ] App opens to NFCProfile screen
- [ ] Error message displays: "Invalid sharing link"
- [ ] Helpful message: "Please check the link and try again"
- [ ] "Go Back" button is available
- [ ] No app crash or freeze

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 10: Cross-Platform (iOS Writer → Android Reader)

**Objective:** Verify cross-platform NFC compatibility

**Prerequisites:**
- [ ] iOS device with NFC support (iPhone 7+)
- [ ] Android device with NFC
- [ ] App installed on both devices

**Steps:**
1. [ ] On iOS device, generate token and write to NFC tag
2. [ ] On Android device, read the NFC tag
3. [ ] Verify profile displays correctly

**Expected Results:**
- [ ] iOS successfully writes NDEF URI record
- [ ] Android successfully reads the tag
- [ ] Profile displays correctly on Android
- [ ] No format compatibility issues

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 11: Network Offline Handling

**Objective:** Verify graceful handling when offline

**Steps:**
1. [ ] Generate token while online
2. [ ] Turn off WiFi and mobile data
3. [ ] Try to generate new token
4. [ ] Try to view shared profile via token

**Expected Results:**
- [ ] Token generation fails with appropriate error
- [ ] Profile viewing fails with network error
- [ ] Error messages are clear and helpful
- [ ] App doesn't crash
- [ ] Retry works when network restored

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

### Test 12: UI/UX Validation

**Objective:** Verify user interface quality

**Areas to Check:**
- [ ] NFCShare Screen:
  - [ ] All text is readable
  - [ ] Buttons are properly sized and clickable
  - [ ] Timer displays correctly
  - [ ] Colors match app theme
  - [ ] Layout works in portrait mode
  - [ ] Scrolling works if needed
  
- [ ] NFCProfile Screen:
  - [ ] Profile card displays nicely
  - [ ] Avatar/placeholder renders correctly
  - [ ] Stats cards are well-formatted
  - [ ] Long usernames don't break layout
  - [ ] Back button works
  
- [ ] Dark Mode (if enabled):
  - [ ] All screens readable in dark mode
  - [ ] Colors are appropriate

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

## Performance Tests

### Test 13: Token Generation Speed

**Objective:** Verify token generation is fast

**Steps:**
1. [ ] Time how long token generation takes
2. [ ] Repeat 5 times

**Expected Results:**
- [ ] Token generation completes in < 2 seconds
- [ ] UI remains responsive during generation

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Timing Results:**
```
Run 1: ___ seconds
Run 2: ___ seconds
Run 3: ___ seconds
Run 4: ___ seconds
Run 5: ___ seconds
Average: ___ seconds
```

---

### Test 14: Profile Loading Speed

**Objective:** Verify profile loads quickly via token

**Steps:**
1. [ ] Open profile via valid token
2. [ ] Time from tap to full profile display
3. [ ] Repeat 5 times

**Expected Results:**
- [ ] Profile loads in < 3 seconds on good connection
- [ ] Loading spinner shows during fetch

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Timing Results:**
```
Run 1: ___ seconds
Run 2: ___ seconds
Run 3: ___ seconds
Run 4: ___ seconds
Run 5: ___ seconds
Average: ___ seconds
```

---

## Security Tests

### Test 15: Token Access Control

**Objective:** Verify tokens only expose public data

**Steps:**
1. [ ] Generate token for User A
2. [ ] Access profile using token
3. [ ] Verify what data is exposed

**Expected Results:**
- [ ] Username is visible
- [ ] Avatar URL is visible
- [ ] Public stats are visible
- [ ] Email is NOT visible
- [ ] Password is NOT accessible
- [ ] Private user data is NOT exposed

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Pass / ❌ Fail

**Notes:**
```
[Add any observations or issues here]
```

---

## Test Summary

**Total Tests:** 15  
**Passed:** ___  
**Failed:** ___  
**Not Started:** ___  

**Overall Status:** ⬜ Not Started / 🟡 In Progress / ✅ All Pass / ❌ Has Failures

**Date Tested:** ___________  
**Tested By:** ___________  
**Device(s) Used:** ___________

**Critical Issues Found:**
```
[List any critical issues that must be fixed before release]
```

**Minor Issues Found:**
```
[List any minor issues or improvements]
```

**Recommendations:**
```
[Add any recommendations for improvements or next steps]
```
