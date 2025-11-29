# 📱 Rwanda Music Tracker - Mobile App

Modern React Native mobile application for tracking Rwandan music plays.

## ✅ Setup Complete!

The Android and iOS native projects have been initialized. You can now run the app!

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- Android Studio (for Android) or Xcode (for iOS)
- Backend server running on `http://localhost:3000`

### Run on Android

1. **Start Metro Bundler:**
   ```bash
   npm start
   ```

2. **In a new terminal, run:**
   ```bash
   npm run android
   ```

### Run on iOS (macOS only)

1. **Install CocoaPods dependencies (first time only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **Start Metro Bundler:**
   ```bash
   npm start
   ```

3. **In a new terminal, run:**
   ```bash
   npm run ios
   ```

## 📱 Features

- 🎵 Modern UI/UX with beautiful screens
- 🔐 Authentication (Login/Register)
- 📊 Dashboard with stats
- 📝 Play history tracking
- 👤 User profile management
- 🎶 Background music detection service

## 🔧 Troubleshooting

**"Android project not found" error?**
- Make sure you're in the `mobile` directory
- Verify `android` folder exists: `ls android` (Mac/Linux) or `dir android` (Windows)

**Build errors?**
- Clean build: `cd android && ./gradlew clean && cd ..`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Metro bundler issues?**
- Clear cache: `npm start -- --reset-cache`

## 📚 More Info

See `MOBILE_SETUP.md` for detailed setup instructions.

