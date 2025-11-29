# 🔍 Finding Your Mac's IP Address for iPhone Connection

When running the app on your **physical iPhone 12 Pro**, you need to connect to your Mac's backend server. Here's how to find your Mac's IP address:

## Method 1: Using Terminal (Easiest)

Open Terminal and run:

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Look for a line like:
```
inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

Your IP address is the number after `inet` (e.g., `192.168.1.100`)

## Method 2: System Preferences

1. Open **System Preferences** (or **System Settings** on newer macOS)
2. Click **Network**
3. Select your active connection (Wi-Fi or Ethernet)
4. Your IP address is shown on the right

## Method 3: Network Utility

1. Open **Terminal**
2. Run: `networksetup -getinfo "Wi-Fi"` (or "Ethernet" for wired)
3. Look for "IP address"

## 📝 Update API Configuration

Once you have your IP address (e.g., `192.168.1.100`):

1. Open `mobile/src/services/api.js`
2. Find the line: `return 'http://localhost:3000/api/v1';`
3. Replace with: `return 'http://192.168.1.100:3000/api/v1';` (use your actual IP)

Or uncomment and update this line:
```javascript
// return 'http://YOUR_MAC_IP:3000/api/v1';
```

## ⚠️ Important Notes

- **Same WiFi**: Your Mac and iPhone must be on the **same WiFi network**
- **Firewall**: Make sure your Mac's firewall allows connections on port 3000
- **Backend Running**: Make sure your backend server is running (`npm run dev` in `backend` folder)

## 🔥 Quick Test

After updating the IP, test the connection:
1. On your iPhone, open Safari
2. Go to: `http://YOUR_MAC_IP:3000/api/v1/health` (if you have a health endpoint)
3. You should see a response

If it doesn't work, check:
- Mac and iPhone on same WiFi
- Backend server is running
- Firewall settings on Mac

