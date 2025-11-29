# 📱 Running on iPhone 12 Pro - Complete Guide

This guide will help you run the Rwanda Music Tracker app on your iPhone 12 Pro.

## 📋 Prerequisites

### Required Software:
1. **macOS** - You must be on a Mac (Xcode only runs on macOS)
2. **Xcode** - Latest version from Mac App Store (free)
3. **CocoaPods** - Dependency manager for iOS
4. **Node.js** - Already installed

### For Physical iPhone (Your iPhone 12 Pro):
- **Apple Developer Account** (Free account works for development)
- **USB Cable** to connect your iPhone
- **Trust the computer** on your iPhone when prompted

## 🚀 Step-by-Step Setup

### Step 1: Install CocoaPods (First Time Only)

Open Terminal and run:

```bash
sudo gem install cocoapods
```

Enter your Mac password when prompted.

### Step 2: Install iOS Dependencies

Navigate to the mobile directory and install CocoaPods dependencies:

```bash
cd mobile/ios
pod install
cd ../..
```

**Note:** This may take a few minutes the first time.

### Step 3: Open Project in Xcode

```bash
cd mobile
open ios/RwandaMusicTracker.xcworkspace
```

**Important:** Use `.xcworkspace` NOT `.xcodeproj`!

### Step 4: Configure Signing & Capabilities

#### Option A: Run on iPhone Simulator (Easiest - No Apple ID needed)

1. In Xcode, click on **"RwandaMusicTracker"** in the left sidebar
2. Select the **"RwandaMusicTracker"** target
3. Go to **"Signing & Capabilities"** tab
4. Under **"Team"**, select **"None"** (for simulator)
5. At the top, next to the play button, select **"iPhone 12 Pro"** or any iPhone simulator
6. Click the **Play button** (▶️) or press `Cmd + R`

#### Option B: Run on Your Physical iPhone 12 Pro

1. **Connect your iPhone** to your Mac via USB
2. **Unlock your iPhone** and tap **"Trust This Computer"** if prompted
3. In Xcode, click on **"RwandaMusicTracker"** in the left sidebar
4. Select the **"RwandaMusicTracker"** target
5. Go to **"Signing & Capabilities"** tab
6. Under **"Team"**, click **"Add Account..."**
   - Sign in with your Apple ID (free account works!)
   - Select your team
7. Xcode will automatically create a provisioning profile
8. At the top, next to the play button, select **"Your iPhone 12 Pro"** from the device list
9. Click the **Play button** (▶️) or press `Cmd + R`

**First time on physical device:**
- On your iPhone, go to **Settings → General → VPN & Device Management**
- Tap on your developer certificate
- Tap **"Trust"**

### Step 5: Start Metro Bundler

**Before running in Xcode**, start Metro bundler in Terminal:

```bash
cd mobile
npm start
```

Keep this terminal open!

### Step 6: Run the App

Now click the **Play button** in Xcode or press `Cmd + R`.

The app will build and install on your iPhone 12 Pro! 🎉

## 🎯 Alternative: Command Line Method

You can also run from Terminal:

```bash
cd mobile
npm start          # Terminal 1 - Keep running
npm run ios        # Terminal 2 - This will open simulator
```

For physical device:
```bash
cd mobile
npm start
# Then in Xcode, select your device and press Cmd+R
```

## 🔧 Troubleshooting

### "No devices found" or "iPhone not detected"

1. **Unlock your iPhone**
2. **Trust the computer** on your iPhone
3. **Check USB cable** - try a different cable
4. **Restart Xcode** and reconnect iPhone
5. In Xcode: **Window → Devices and Simulators** - check if iPhone appears

### "Signing for RwandaMusicTracker requires a development team"

1. Go to **Signing & Capabilities** in Xcode
2. Click **"Add Account..."** under Team
3. Sign in with your Apple ID (free account works!)
4. Select your team from the dropdown

### "Could not launch RwandaMusicTracker"

1. On your iPhone: **Settings → General → VPN & Device Management**
2. Find your developer certificate
3. Tap it and select **"Trust"**
4. Try running again

### "Pod install failed"

```bash
cd mobile/ios
rm -rf Pods Podfile.lock
pod install
cd ../..
```

### "Metro bundler connection failed"

1. Make sure Metro is running: `npm start` in `mobile` folder
2. Check that your Mac and iPhone are on the **same WiFi network**
3. In Xcode, check **Product → Scheme → Edit Scheme → Run → Arguments**
   - Make sure "React Native Debugger" is enabled

### "Build failed" or "Compile errors"

1. **Clean build folder**: In Xcode, `Product → Clean Build Folder` (Shift+Cmd+K)
2. **Delete derived data**: 
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```
3. **Reinstall pods**:
   ```bash
   cd mobile/ios
   rm -rf Pods Podfile.lock
   pod install
   ```

### App crashes on launch

1. Check Metro bundler is running
2. Check console logs in Xcode (bottom panel)
3. Make sure backend server is running on `http://localhost:3000`
4. For physical device, update API URL in `mobile/src/services/api.js` to use your Mac's IP address

## 📱 Running on Physical Device - Network Setup

If running on your physical iPhone, you need to update the API URL:

1. **Find your Mac's IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Look for something like `192.168.1.100`

2. **Update API URL** in `mobile/src/services/api.js`:
   ```javascript
   const API_BASE_URL = __DEV__
     ? Platform.OS === 'ios'
       ? 'http://YOUR_MAC_IP:3000/api/v1'  // Replace YOUR_MAC_IP
       : 'http://localhost:3000/api/v1'
     : 'https://api.rwandamusic.com/api/v1';
   ```

3. **Make sure Mac and iPhone are on same WiFi**

## ✅ Quick Checklist

- [ ] macOS computer
- [ ] Xcode installed
- [ ] CocoaPods installed (`sudo gem install cocoapods`)
- [ ] Ran `pod install` in `mobile/ios`
- [ ] Opened `.xcworkspace` (not `.xcodeproj`)
- [ ] Configured signing in Xcode
- [ ] iPhone connected and trusted
- [ ] Metro bundler running (`npm start`)
- [ ] Backend server running (`npm run dev` in `backend`)

## 🎉 Success!

Once the app launches on your iPhone 12 Pro, you'll see:
- Beautiful login screen
- Modern UI/UX
- All features working!

---

**Need help?** Check the console logs in Xcode (bottom panel) for error messages.

