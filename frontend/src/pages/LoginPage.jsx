import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield } from 'react-feather';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    
    try {
      setIsLoading(true);
      
      await login(formData);
      
      // Redirect to dashboard on successful login
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Invalid credentials. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle demo login
  const handleDemoLogin = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      await login({
        email: 'demo@example.com',
        password: 'demo123'
      });
      
      // Redirect to dashboard on successful login
      navigate('/');
    } catch (error) {
      console.error('Demo login error:', error);
      setErrorMessage('Demo login failed. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="cyber-background"></div>
      
      <div className="login-card">
        <div className="login-logo">
          <div className="logo">
            <Shield size={40} className="logo-icon" />
            <div className="logo-text">
              <span className="logo-text-main">RED TEAM</span>
              <span className="logo-text-sub">DASHBOARD</span>
            </div>
          </div>
        </div>
        
        <h1 className="login-title">Secure Access</h1>
        <p className="login-subtitle mono">AUTHENTICATION REQUIRED</p>
        
        {showError && (
          <div className="error-alert">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
            
            <div className="form-action-divider">
              <span>OR</span>
            </div>
            
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Access Demo Account
            </button>
          </div>
        </form>
        
        <div className="login-footer">
          <p className="security-notice mono">
            SECURE CONNECTION ACTIVE · TLS 1.3 · BIT DEPTH 256
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
