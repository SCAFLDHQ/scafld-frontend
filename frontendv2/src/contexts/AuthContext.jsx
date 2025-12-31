import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const response = await apiService.getProfile();
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      const data = await response.json();

      if (response.ok) {
        apiService.setTokens(data.access, data.refresh);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || data.detail || data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      const data = await response.json();

      if (response.ok) {
        apiService.setTokens(data.access, data.refresh);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || data.detail || data.message || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const googleLogin = async (token) => {
    try {
      const response = await apiService.googleOAuth(token);
      const data = await response.json();

      if (response.ok) {
        apiService.setTokens(data.access, data.refresh);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || data.detail || data.message || 'Google login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Google login failed. Please try again.' };
    }
  };

  const githubLogin = async (code) => {
    try {
      const response = await apiService.githubOAuth(code);
      const data = await response.json();

      if (response.ok) {
        apiService.setTokens(data.access, data.refresh);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || data.detail || data.message || 'GitHub login failed' };
      }
    } catch (error) {
      return { success: false, error: 'GitHub login failed. Please try again.' };
    }
  };

  const logout = () => {
    apiService.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    googleLogin,
    githubLogin,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};