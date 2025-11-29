# 🚀 iPhone 12 Pro - Quick Start

## Fastest Way to Run on Your iPhone

### 1. Install CocoaPods (First Time Only)
```bash
sudo gem install cocoapods
```

### 2. Install iOS Dependencies
```bash
cd mobile/ios
pod install
cd ../..
```

### 3. Open in Xcode
```bash
cd mobile
open ios/RwandaMusicTracker.xcworkspace
```

### 4. Configure Signing
1. In Xcode, click **"RwandaMusicTracker"** (left sidebar)
2. Select **"RwandaMusicTracker"** target
3. Go to **"Signing & Capabilities"**
4. Under **"Team"**, click **"Add Account..."**
5. Sign in with your Apple ID (free!)
6. Select your team

### 5. Select Your iPhone
1. At the top of Xcode, click the device selector
2. Select **"Your iPhone 12 Pro"**

### 6. Start Metro Bundler
```bash
cd mobile
npm start
```
Keep this terminal open!

### 7. Run!
In Xcode, click the **Play button** (▶️) or press `Cmd + R`

## First Time on iPhone?
On your iPhone: **Settings → General → VPN & Device Management → Trust**

## Using Simulator Instead?
Just select **"iPhone 12 Pro"** from the device dropdown in Xcode (no signing needed!)

---

For detailed instructions, see `IOS_SETUP.md`

