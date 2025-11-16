# StatsGames

Game Statistics with NFC - Flutter Mobile Application

## 📱 About

A Flutter mobile application for displaying game statistics from Supercell games and sharing profiles via NFC.

### Planned Features

- 🚧 User Authentication (Email/Password + Magic Link)
- 🚧 Protected Routes
- 🚧 User Profile Management
- 🚧 Game Statistics Dashboard
- 🚧 NFC Profile Sharing

## 🚀 Getting Started

This repository has been cleaned and is ready for Flutter development.

### Prerequisites

- Flutter SDK (latest stable version)
- Dart SDK (included with Flutter)
- Android Studio / Xcode for mobile development
- VS Code or Android Studio as IDE

### Setup Instructions

1. Install Flutter by following the [official Flutter installation guide](https://docs.flutter.dev/get-started/install)

2. Verify Flutter installation:
```bash
flutter doctor
```

3. Create a new Flutter project in this repository:
```bash
flutter create .
```

4. Install dependencies:
```bash
flutter pub get
```

5. Run the application:
```bash
# For iOS
flutter run -d ios

# For Android
flutter run -d android

# For Web
flutter run -d chrome
```

## 📁 Project Structure

Once initialized, the Flutter project will follow this structure:

```
lib/
├── main.dart           # Application entry point
├── screens/            # Application screens
├── widgets/            # Reusable UI components
├── services/           # API and business logic
├── models/             # Data models
├── providers/          # State management
└── theme/              # App theme and styling
```

## 🔧 Backend Integration

The project uses Supabase as the backend. Configuration can be found in `supabase.yml`.

## 📝 Development Notes

- This repository was previously a React Native/Expo project and has been cleaned for Flutter migration
- Supabase configuration has been preserved for backend integration
- Follow Flutter best practices and clean architecture principles

## 🎯 Next Steps

1. Initialize Flutter project with `flutter create`
2. Set up project structure (screens, widgets, services)
3. Configure Supabase integration
4. Implement authentication system
5. Build game statistics dashboard
6. Add NFC functionality
