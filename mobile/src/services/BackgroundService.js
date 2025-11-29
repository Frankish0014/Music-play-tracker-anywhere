import { Platform, NativeModules, AppState } from 'react-native';
import { AudioFingerprinting } from './AudioFingerprinting';
import { batchAPI } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

class BackgroundService {
  constructor() {
    this.isRunning = false;
    this.playQueue = [];
    this.deviceId = null;
    this.syncInterval = null;
  }

  async initialize() {
    // Get or create device ID
    let deviceId = await AsyncStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      await AsyncStorage.setItem('device_id', deviceId);
    }
    this.deviceId = deviceId;

    // Start background service
    if (Platform.OS === 'android') {
      this.startAndroidService();
    } else {
      this.startIOSService();
    }

    // Start periodic sync
    this.startSync();
  }

  generateDeviceId() {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  startAndroidService() {
    // Android: Use ForegroundService for continuous operation
    // This requires native module implementation
    console.log('Starting Android background service...');
    this.isRunning = true;
    this.startListening();
  }

  startIOSService() {
    // iOS: Use background tasks and MediaPlayer framework
    console.log('Starting iOS background service...');
    this.isRunning = true;
    this.startListening();
  }

  async startListening() {
    if (!this.isRunning) return;

    try {
      // Sample audio every 15 seconds
      const audioSample = await AudioFingerprinting.captureSample(15); // 15 seconds
      const fingerprint = await AudioFingerprinting.generateFingerprint(audioSample);
      
      // Match against local database
      const match = await AudioFingerprinting.matchLocal(fingerprint);
      
      if (match && match.confidence > 60) {
        // Get location
        const location = await this.getCurrentLocation();
        
        // Add to queue
        this.playQueue.push({
          song_id: match.song_id,
          timestamp: new Date().toISOString(),
          source: 'background_listen',
          confidence: match.confidence,
          location: location,
        });

        // Sync if queue is large enough
        if (this.playQueue.length >= 50) {
          await this.syncPlays();
        }
      }
    } catch (error) {
      console.error('Error in background listening:', error);
    }

    // Schedule next sample
    setTimeout(() => this.startListening(), 15000); // 15 seconds
  }

  async getCurrentLocation() {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          resolve(null); // Location unavailable
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    });
  }

  async syncPlays() {
    if (this.playQueue.length === 0) return;

    try {
      const plays = [...this.playQueue];
      this.playQueue = [];

      const deviceInfo = {
        device_id: this.deviceId,
        phone_model: Platform.constants.Brand || 'Unknown',
        os_version: Platform.Version.toString(),
        app_version: '1.0.0',
      };

      await batchAPI.uploadPlays({
        ...deviceInfo,
        plays: plays,
      });

      console.log(`Synced ${plays.length} plays`);
    } catch (error) {
      console.error('Error syncing plays:', error);
      // Re-add to queue on error
      this.playQueue.unshift(...plays);
    }
  }

  startSync() {
    // Sync every hour
    this.syncInterval = setInterval(() => {
      this.syncPlays();
    }, 3600000); // 1 hour

    // Also sync when app comes to foreground
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        this.syncPlays();
      }
    });
  }

  stop() {
    this.isRunning = false;
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

export const BackgroundService = new BackgroundService();

