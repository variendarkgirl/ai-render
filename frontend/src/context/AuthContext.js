import React, { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, checkAuthStatus } from '../services/authService';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        setUser(userData);
      } catch (err) {
        // Not logged in, that's okay
        console.log('User not authenticated');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await loginUser(credentials);
      setUser(userData);
      
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear the user from context even if API call fails
      setUser(null);
    }
  };
  
  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
