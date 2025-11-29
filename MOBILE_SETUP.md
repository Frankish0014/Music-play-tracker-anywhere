# 📱 Mobile App Setup & Run Guide

This guide will help you set up and run the Rwandan Music Tracker mobile app on Android or iOS.

## 📋 Prerequisites

### For Android Development:
1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Java Development Kit (JDK)** - Version 11 or higher
3. **Android Studio** - [Download](https://developer.android.com/studio)
4. **Android SDK** - Install via Android Studio
5. **Android Emulator** or Physical Android Device

### For iOS Development (macOS only):
1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Xcode** - Latest version from Mac App Store
3. **CocoaPods** - `sudo gem install cocoapods`
4. **iOS Simulator** or Physical iOS Device

## 🚀 Quick Start

### Step 1: Install Dependencies

Navigate to the mobile directory and install dependencies:

```bash
cd mobile
npm install
```

### Step 2: Install iOS Dependencies (iOS only)

If you're developing for iOS, install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

### Step 3: Start Metro Bundler

In a terminal, start the React Native Metro bundler:

```bash
npm start
```

Or from the root directory:

```bash
cd mobile
npm start
```

Keep this terminal running!

### Step 4: Run on Android

**Option A: Using Android Emulator**

1. Open Android Studio
2. Start an Android Virtual Device (AVD) or use a physical device with USB debugging enabled
3. In a new terminal, run:

```bash
npm run android
```

**Option B: Using Physical Device**

1. Enable USB debugging on your Android device
2. Connect your device via USB
3. Run:

```bash
npm run android
```

### Step 5: Run on iOS (macOS only)

**Option A: Using iOS Simulator**

1. Open Xcode
2. In a terminal, run:

```bash
npm run ios
```

**Option B: Using Physical Device**

1. Connect your iPhone/iPad via USB
2. Open the project in Xcode: `open ios/RwandaMusicTracker.xcworkspace`
3. Select your device in Xcode
4. Click "Run" or press `Cmd + R`

## 🎨 Running in Mobile View (Web App)

If you want to test the web app in mobile view without running the native app:

### Method 1: Browser DevTools

1. Open your web app: `http://localhost:3001`
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Click the device toggle icon (or press `Ctrl+Shift+M` / `Cmd+Shift+M`)
4. Select a mobile device preset (iPhone, iPad, etc.)
5. Refresh the page

### Method 2: Responsive Design Mode

1. In Chrome/Edge: Open DevTools → Toggle device toolbar
2. In Firefox: Open DevTools → Toggle responsive design mode
3. Select a mobile device from the dropdown
4. Test different screen sizes

### Method 3: Test on Real Mobile Device

1. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - macOS/Linux: `ifconfig` or `ip addr`
2. Make sure your phone and computer are on the same WiFi network
3. On your phone's browser, navigate to: `http://YOUR_IP_ADDRESS:3001`
   - Example: `http://192.168.1.100:3001`

## 🔧 Troubleshooting

### Android Issues

**"SDK location not found"**
- Set `ANDROID_HOME` environment variable:
  - Windows: `set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk`
  - macOS/Linux: `export ANDROID_HOME=$HOME/Library/Android/sdk`

**"Gradle build failed"**
- Clean the project: `cd android && ./gradlew clean && cd ..`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**"Metro bundler not starting"**
- Clear Metro cache: `npm start -- --reset-cache`
- Kill any running Metro processes

### iOS Issues

**"Pod install failed"**
- Update CocoaPods: `sudo gem install cocoapods`
- Clean pods: `cd ios && rm -rf Pods Podfile.lock && pod install && cd ..`

**"Build failed in Xcode"**
- Clean build folder: In Xcode, `Product → Clean Build Folder` (Shift+Cmd+K)
- Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`

**"Simulator not launching"**
- Open Simulator manually: `open -a Simulator`
- Or via Xcode: `Xcode → Open Developer Tool → Simulator`

### General Issues

**"Cannot connect to Metro bundler"**
- Make sure Metro is running: `npm start`
- Check if port 8081 is available
- Try: `npm start -- --port 8082`

**"Module not found"**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear watchman: `watchman watch-del-all`

**"Backend API connection failed"**
- For Android Emulator, use `http://10.0.2.2:3000` (already configured)
- For iOS Simulator, use `http://localhost:3000` (already configured)
- For physical devices, use your computer's IP address

## 📱 App Features

### Current Screens:
- **Login Screen** - Modern authentication UI
- **Register Screen** - User registration
- **Home Screen** - Dashboard with stats and tracking info
- **Play Log Screen** - History of detected music plays
- **Profile Screen** - User settings and profile

### Background Service:
- Continuously listens for music in the background
- Samples audio every 15 seconds
- Matches songs using audio fingerprinting
- Syncs data when WiFi is available

## 🎯 Development Tips

1. **Hot Reload**: Changes automatically reload (shake device to open dev menu)
2. **Debug Menu**: Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
3. **Reload**: Press `R` twice in Metro bundler terminal
4. **Remote Debugging**: Enable in dev menu for Chrome DevTools debugging

## 📦 Building for Production

### Android APK:
```bash
cd android
./gradlew assembleRelease
# APK will be in: android/app/build/outputs/apk/release/
```

### iOS Build:
1. Open Xcode: `open ios/RwandaMusicTracker.xcworkspace`
2. Select "Any iOS Device" or your device
3. Product → Archive
4. Follow the App Store submission process

## 🔗 Useful Commands

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear Metro cache
npm start -- --reset-cache

# Run tests
npm test

# Check for issues
npx react-native doctor
```

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Android Studio Setup](https://developer.android.com/studio)
- [Xcode Setup](https://developer.apple.com/xcode/)

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review React Native documentation
3. Check console logs in Metro bundler
4. Check device logs: `adb logcat` (Android) or Xcode console (iOS)

---

**Happy Coding! 🎵📱**

