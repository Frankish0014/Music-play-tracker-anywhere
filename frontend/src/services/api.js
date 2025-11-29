import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network errors for debugging
    if (!error.response) {
      console.error('Network error:', error.message);
      if (error.code === 'ECONNREFUSED') {
        error.message = 'Cannot connect to server. Please ensure the backend is running on http://localhost:3000';
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/users/me'),
};

export const songsAPI = {
  getAll: (params) => api.get('/songs', { params }),
  getById: (id) => api.get(`/songs/${id}`),
  create: (data) => api.post('/songs', data),
};

export const artistsAPI = {
  getAll: (params) => api.get('/artists', { params }),
  getById: (id) => api.get(`/artists/${id}`),
  update: (id, data) => api.put(`/artists/${id}`, data),
};

export const venuesAPI = {
  getAll: (params) => api.get('/venues', { params }),
  getById: (id) => api.get(`/venues/${id}`),
  create: (data) => api.post('/venues', data),
};

export const analyticsAPI = {
  getTopSongs: (params) => api.get('/analytics/top-songs', { params }),
  getTopArtists: (params) => api.get('/analytics/top-artists', { params }),
  getArtistAnalytics: (id, params) => api.get(`/analytics/artists/${id}`, { params }),
};

export const playEventsAPI = {
  create: (data) => api.post('/plays', data),
  getAll: (params) => api.get('/plays', { params }),
};

export default api;

