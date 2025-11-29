import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user && !justLoggedIn) {
      // Only fetch if we don't have a user and didn't just log in
      fetchUser();
    } else if (!token) {
      setLoading(false);
    } else if (user || justLoggedIn) {
      // If we have a user or just logged in, we're done loading
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      console.log('fetchUser - Starting...');
      const response = await authAPI.getCurrentUser();
      console.log('fetchUser response:', response);
      const user = response.data.data?.user || response.data.user;
      console.log('Extracted user:', user);
      if (user) {
        console.log('fetchUser - Setting user:', user);
        setUser(user);
        setLoading(false);
      } else {
        console.warn('No user in response');
        // Don't clear token if we got a response but no user
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error response:', error.response?.data);
      // Only remove token if it's a 401 (unauthorized) or 403 (forbidden)
      // AND we don't have a user already (don't clear if we just logged in)
      if ((error.response?.status === 401 || error.response?.status === 403) && !user && !justLoggedIn) {
        console.log('Unauthorized - clearing token and user');
        localStorage.removeItem('token');
        setUser(null);
      } else {
        // For other errors or if we have a user, keep the existing state
        console.log('Non-auth error or user exists - keeping existing user state');
        // Don't clear the user state on network errors or if we just logged in
      }
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    console.log('Login response:', response);
    const token = response.data.data?.token || response.data.token;
    const user = response.data.data?.user || response.data.user;
    
    console.log('Login - Extracted token:', token ? 'Present' : 'Missing');
    console.log('Login - Extracted user:', user);
    
    if (token) {
      localStorage.setItem('token', token);
    }
    if (user) {
      setJustLoggedIn(true); // Mark that we just logged in
      setUser(user);
      setLoading(false); // Ensure loading is false after setting user
      console.log('Login - User set in state:', user);
      // Clear the flag after a short delay
      setTimeout(() => setJustLoggedIn(false), 2000);
    } else {
      console.warn('No user in login response, fetching...');
      // If user not in response, fetch it
      await fetchUser();
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const token = response.data.data?.token || response.data.token;
    const user = response.data.data?.user || response.data.user;
    
    if (token) {
      localStorage.setItem('token', token);
    }
    if (user) {
      setUser(user);
    } else {
      // If user not in response, fetch it
      await fetchUser();
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
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

