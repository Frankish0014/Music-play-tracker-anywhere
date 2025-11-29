import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * For production, update the PRODUCTION_API_URL below.
 * For development, the app will automatically detect the correct URL based on platform.
 */

// Production API URL - Update this for production builds
const PRODUCTION_API_URL = 'https://api.rwandamusic.com/api/v1';

/**
 * Get the API base URL based on environment and platform
 */
export const getApiBaseUrl = () => {
  // Production mode
  if (!__DEV__) {
    return PRODUCTION_API_URL;
  }

  // Development mode - platform-specific URLs
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:3000/api/v1';
  }

  // iOS - localhost works for simulator
  // For physical device, you'll need to use your Mac's IP address
  // Example: 'http://192.168.1.100:3000/api/v1'
  return 'http://localhost:3000/api/v1';
};

/**
 * API Configuration object
 */
export const apiConfig = {
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default apiConfig;

