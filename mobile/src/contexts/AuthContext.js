import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await authAPI.getCurrentUser();
        // Handle nested response structure
        const userData = response.data?.data?.user || response.data?.user || response.data;
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Only clear token on auth errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        await AsyncStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    // Handle nested response structure
    const responseData = response.data?.data || response.data;
    const token = responseData.token || responseData.data?.token;
    const user = responseData.user || responseData.data?.user;
    
    if (token) {
      await AsyncStorage.setItem('token', token);
    }
    if (user) {
      setUser(user);
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    // Handle nested response structure
    const responseData = response.data?.data || response.data;
    const token = responseData.token || responseData.data?.token;
    const user = responseData.user || responseData.data?.user;
    
    if (token) {
      await AsyncStorage.setItem('token', token);
    }
    if (user) {
      setUser(user);
    }
    return response;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

