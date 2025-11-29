# 🚀 Mobile App Quick Start

## Running the Mobile App

### Prerequisites Check
- ✅ Node.js installed
- ✅ Backend server running (`npm run dev` in `backend` folder)
- ✅ Docker containers running (PostgreSQL & Redis)

### Android (Easiest)

1. **Start Metro Bundler:**
   ```bash
   cd mobile
   npm start
   ```

2. **In a new terminal, run Android app:**
   ```bash
   cd mobile
   npm run android
   ```

### iOS (macOS only)

1. **Install CocoaPods dependencies (first time only):**
   ```bash
   cd mobile/ios
   pod install
   cd ../..
   ```

2. **Start Metro Bundler:**
   ```bash
   cd mobile
   npm start
   ```

3. **In a new terminal, run iOS app:**
   ```bash
   cd mobile
   npm run ios
   ```

## 🖥️ Running Web App in Mobile View

### Option 1: Browser DevTools (Easiest)

1. Open `http://localhost:3001` in your browser
2. Press `F12` to open DevTools
3. Click the device toggle icon (📱) or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
4. Select a mobile device (iPhone, Android, etc.)
5. Refresh the page

### Option 2: Test on Real Phone

1. **Find your computer's IP:**
   - Windows: Open PowerShell → `ipconfig` → Look for "IPv4 Address"
   - Mac/Linux: Open Terminal → `ifconfig` or `ip addr`

2. **Make sure phone and computer are on same WiFi**

3. **On your phone's browser, go to:**
   ```
   http://YOUR_IP_ADDRESS:3001
   ```
   Example: `http://192.168.1.100:3001`

## 🎯 Quick Troubleshooting

**Metro bundler won't start?**
```bash
cd mobile
npm start -- --reset-cache
```

**App won't connect to backend?**
- Android Emulator: Already configured (`http://10.0.2.2:3000`)
- iOS Simulator: Already configured (`http://localhost:3000`)
- Physical Device: Use your computer's IP address

**Build errors?**
```bash
cd mobile
rm -rf node_modules
npm install
```

## 📱 What You'll See

- **Login Screen** - Beautiful modern UI
- **Home Screen** - Dashboard with stats
- **Play Log** - History of detected music
- **Profile** - Settings and user info

---

For detailed setup, see `MOBILE_SETUP.md`

