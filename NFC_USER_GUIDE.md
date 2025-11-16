# NFC Profile Sharing - Quick Start Guide

## What is it?

Share your StatsGames profile and statistics with friends using NFC (Near Field Communication) or shareable links. Tokens automatically expire after 15 minutes for security.

## How to Use

### Sharing Your Profile

1. **Open the App** → Navigate to Home
2. **Tap "Share via NFC"** → Opens the NFC Share screen
3. **Generate Token** → Tap "Generate Token" button
4. **Choose Sharing Method:**
   - **NFC Tag**: Tap "Write to NFC Tag" and hold your device near an NFC tag
   - **Copy Link**: Tap "Copy Link" to copy the URL and share it via messaging apps, email, etc.
5. **Share** → Give the NFC tag or link to friends
6. **Expire** → Token automatically expires after 15 minutes

### Viewing a Shared Profile

**Option 1 - Via NFC Tag:**
1. Hold your NFC-enabled device near the tag
2. App opens automatically showing the shared profile

**Option 2 - Via Link:**
1. Tap the shared link
2. App opens automatically showing the shared profile

## What's Shared?

When you share your profile, others can see:
- ✅ Your username
- ✅ Your avatar/profile picture
- ✅ Your public game statistics
- ❌ NOT your email or private information

## Security Features

- 🔒 **15-Minute Expiration**: Tokens automatically expire
- 🔒 **Public Data Only**: No sensitive information is shared
- 🔒 **Unique Tokens**: Each sharing session gets a unique token
- 🔒 **Revocable**: Tokens become invalid after expiration

## Requirements

### For NFC Sharing
- **Android**: Most Android devices (Android 4.4+)
- **iOS**: iPhone 7 or later with iOS 13+

### For Link Sharing
- **Any Device**: Works on all devices via web links

## Troubleshooting

### NFC Not Working?
- ✓ Enable NFC in your device settings
- ✓ Hold device steady near tag for 1-2 seconds
- ✓ Try different positions/angles
- ✓ Use link sharing as fallback

### Link Not Opening App?
- ✓ Ensure the app is installed
- ✓ Check internet connection
- ✓ Verify token hasn't expired (15 min limit)

### "Token Expired" Error?
- ✓ Ask the person to generate a new token
- ✓ Tokens are only valid for 15 minutes after creation

## Technical Details

For developers and technical users, see [NFC_IMPLEMENTATION.md](../NFC_IMPLEMENTATION.md) for:
- Database schema
- API endpoints
- Implementation details
- Testing guide
- Platform-specific notes

## Privacy Notice

Profile sharing via NFC is designed with privacy in mind:
- Only public profile data is accessible via tokens
- Tokens expire automatically after 15 minutes
- No access to private messages, email, or account settings
- You can generate new tokens anytime without affecting old ones

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review [NFC_IMPLEMENTATION.md](../NFC_IMPLEMENTATION.md) for technical details
3. Contact support via the app's Settings → Support

---

**Enjoy sharing your gaming achievements! 🎮📱**
