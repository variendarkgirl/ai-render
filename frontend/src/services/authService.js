import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set token in headers and localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize token from localStorage
const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
};

// Initialize on import
initializeAuth();

/**
 * Login user
 * @param {Object} credentials - User credentials (email, password)
 * @returns {Object} User data
 */
export const loginUser = async (credentials) => {
  try {
    // For development/demo, use mock data
    if (process.env.NODE_ENV === 'development') {
      // Check for demo credentials
      if (
        credentials.email === 'demo@example.com' && 
        credentials.password === 'demo123'
      ) {
        // Mock successful response
        const mockResponse = {
          user: {
            id: 'user123',
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'analyst'
          },
          token: 'mock_jwt_token_for_development'
        };
        
        // Wait to simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set auth token
        setAuthToken(mockResponse.token);
        
        return mockResponse.user;
      } else {
        // Mock failed login
        await new Promise(resolve => setTimeout(resolve, 800));
        throw new Error('Invalid credentials');
      }
    }
    
    // For production, use actual API
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    const { token, user } = response.data;
    
    // Set auth token
    setAuthToken(token);
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Register new user
 * @param {Object} userData - New user data
 * @returns {Object} Created user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    const { token, user } = response.data;
    
    // Set auth token
    setAuthToken(token);
    
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    // For production, call logout endpoint if needed
    // await axios.post(`${API_URL}/auth/logout`);
    
    // Clear token
    setAuthToken(null);
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear token even if API call fails
    setAuthToken(null);
    
    throw error.response?.data || error;
  }
};

/**
 * Check authentication status
 * @returns {Object} User data if authenticated
 */
export const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    // For development/demo, return mock data
    if (process.env.NODE_ENV === 'development') {
      // Mock successful response
      const mockUser = {
        id: 'user123',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'analyst'
      };
      
      // Wait to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockUser;
    }
    
    // For production, validate token with server
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    console.error('Auth check error:', error);
    
    // Clear invalid token
    setAuthToken(null);
    
    throw error.response?.data || error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Object} Updated user data
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/auth/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Change password
 * @param {Object} passwordData - Old and new password
 * @returns {Object} Success message
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/change-password`, passwordData);
    return response.data;
  } catch (error) {
    console.error('Password change error:', error);
    throw error.response?.data || error;
  }
};
