import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await apiService.getProfile();
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.ok) {
        const data = await response.json();
        apiService.setTokens(data.tokens.access, data.tokens.refresh);
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An error occurred during login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.ok) {
        const data = await response.json();
        apiService.setTokens(data.tokens.access, data.tokens.refresh);
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.email?.[0] || 
                           errorData.username?.[0] || 
                           errorData.password?.[0] || 
                           'Registration failed';
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'An error occurred during registration' 
      };
    }
  };

  const googleLogin = async (token) => {
    try {
      const response = await apiService.googleOAuth(token);
      
      if (response.ok) {
        const data = await response.json();
        apiService.setTokens(data.tokens.access, data.tokens.refresh);
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Google login failed' 
        };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        error: 'An error occurred during Google login' 
      };
    }
  };

  const githubLogin = async (code) => {
    try {
      const response = await apiService.githubOAuth(code);
      
      if (response.ok) {
        const data = await response.json();
        apiService.setTokens(data.tokens.access, data.tokens.refresh);
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'GitHub login failed' 
        };
      }
    } catch (error) {
      console.error('GitHub login error:', error);
      return { 
        success: false, 
        error: 'An error occurred during GitHub login' 
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiService.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiService.clearTokens();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    githubLogin,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};