# StatsGames Mobile App

Mobile application for displaying game statistics (Supercell games) and NFC profile sharing.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (installed automatically)
- For iOS development: macOS with Xcode
- For Android development: Android Studio and Android SDK

### Installation

1. Navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

### Running the App

#### Development Server
Start the Expo development server:
```bash
npm start
```

This will open the Expo DevTools in your browser. From there, you can:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)
- Press `w` to open in web browser
- Scan the QR code with the Expo Go app on your physical device

#### Platform-Specific Commands

**Android:**
```bash
npm run android
```

**iOS (macOS only):**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

### Using Physical Device

1. Install the Expo Go app on your device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Run `npm start`

3. Scan the QR code displayed in the terminal or browser with:
   - Camera app (iOS)
   - Expo Go app (Android)

## 📁 Project Structure

```
app/
├── screens/          # Application screens
│   ├── LoadingScreen.js
│   └── HomeScreen.js
├── components/       # Reusable components
├── services/         # API and service integrations
├── theme/           # Theme configuration
│   ├── colors.js    # Color palette
│   ├── typography.js # Typography settings
│   └── styles.js    # Global styles
├── navigation/      # Navigation configuration
│   └── AppNavigator.js
├── assets/          # Images, fonts, etc.
├── App.js           # Root component
└── package.json     # Dependencies
```

## 🎨 Theme

The app uses a light theme by default with:
- **Primary Color:** Blue (#007AFF)
- **Text Styles:** H1, H2, H3, Body, Caption
- **System Font:** Native system font for each platform

## 🔧 Configuration

### Colors
Edit `theme/colors.js` to customize the color palette.

### Typography
Edit `theme/typography.js` to customize fonts, sizes, and weights.

### Navigation
Edit `navigation/AppNavigator.js` to add or modify screens.

## 📱 Features

- ✅ Splash/Loading screen
- ✅ Home screen
- ✅ Navigation setup
- ✅ Theme configuration
- ⏳ Authentication (coming soon)
- ⏳ Game statistics dashboard (coming soon)
- ⏳ NFC profile sharing (coming soon)

## 🛠️ Development

### Adding a New Screen

1. Create a new file in `screens/`:
```javascript
// screens/MyNewScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import { containerStyles, textStyles } from '../theme';

export default function MyNewScreen() {
  return (
    <View style={containerStyles.centered}>
      <Text style={textStyles.h1}>My New Screen</Text>
    </View>
  );
}
```

2. Add it to the navigator in `navigation/AppNavigator.js`:
```javascript
<Stack.Screen name="MyNewScreen" component={MyNewScreen} />
```

### Adding a New Component

Create reusable components in the `components/` directory:
```javascript
// components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, textStyles } from '../theme';

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
  },
  text: {
    ...textStyles.body,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
```

## 📦 Building for Production

### Android
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

For more details, see [Expo Build Documentation](https://docs.expo.dev/build/introduction/).

## 🐛 Troubleshooting

### Metro Bundler Issues
If you encounter bundler issues, try:
```bash
npm start -- --reset-cache
```

### Dependency Issues
Clear node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

### Platform-Specific Issues
- **iOS:** Make sure Xcode is installed and updated
- **Android:** Ensure Android SDK is properly configured

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request

## 📄 License

This project is private and proprietary.
