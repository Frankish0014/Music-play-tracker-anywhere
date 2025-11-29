import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For physical iPhone, you'll need to replace 'YOUR_MAC_IP' with your Mac's IP address
// Find it with: ifconfig | grep "inet " | grep -v 127.0.0.1
const getApiBaseUrl = () => {
  if (!__DEV__) {
    return 'https://api.rwandamusic.com/api/v1'; // Production
  }
  
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api/v1'; // Android emulator
  }
  
  // iOS - Check if running on simulator or physical device
  // For simulator, localhost works
  // For physical device, use your Mac's IP address (update below)
  // Example: 'http://192.168.1.100:3000/api/v1'
  return 'http://localhost:3000/api/v1'; // iOS simulator (default)
  // Uncomment and update for physical iPhone:
  // return 'http://YOUR_MAC_IP:3000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/users/me'),
};

export const batchAPI = {
  uploadPlays: (data) => api.post('/batch/plays', data),
};

export default api;

