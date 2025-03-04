import React, { useState } from 'react';
import { Save, User, Lock, Bell, Shield, Download, Upload } from 'react-feather';
import { useAuth } from '../hooks/useAuth';

const SettingsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'analyst'
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    criticalVulnerabilities: true,
    successfulAttacks: true,
    systemUpdates: false,
    dailyDigest: true
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    ipRestriction: false,
    allowedIPs: ''
  });
  const [importExportSettings, setImportExportSettings] = useState({
    exportFormat: 'json',
    includeUserData: false,
    includeSystemSettings: true
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset status messages when changing tabs
    setSuccess(null);
    setError(null);
  };
  
  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle notification settings change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle security settings change
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle import/export settings change
  const handleImportExportChange = (e) => {
    const { name, value, type, checked } = e.target;
    setImportExportSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Save profile settings
  const saveProfileSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      // In a real app, you would call an API to update the profile
      // await updateUserProfile(profileForm);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess('Profile settings updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Change password
  const changePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      // In a real app, you would call an API to change the password
      // await changeUserPassword(passwordForm);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess('Password changed successfully.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Save notification settings
  const saveNotificationSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      // In a real app, you would call an API to update notification settings
      // await updateNotificationSettings(notificationSettings);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess('Notification settings updated successfully.');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setError('Failed to update notification settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Save security settings
  const saveSecuritySettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      // In a real app, you would call an API to update security settings
      // await updateSecuritySettings(securitySettings);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess('Security settings updated successfully.');
    } catch (error) {
      console.error('Error updating security settings:', error);
      setError('Failed to update security settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Export settings
  const exportSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      // In a real app, you would call an API to export settings
      // const result = await exportUserSettings(importExportSettings);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a mock file download
      const dataStr = JSON.stringify({
        settings: {
          profile: profileForm,
          notifications: notificationSettings,
          security: securitySettings
        },
        exportDate: new Date().toISOString()
      }, null, 2);
      
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.download = 'red-team-dashboard-settings.json';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Settings exported successfully.');
    } catch (error) {
      console.error('Error exporting settings:', error);
      setError('Failed to export settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Import settings (mock function)
  const importSettings = () => {
    // In a real app, you would implement file upload and parsing
    alert('Import settings functionality would be implemented here.');
  };
  
  // Render settings tab
  const renderSettingsTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-section">
            <h2>Profile Settings</h2>
            <p>Update your user profile information.</p>
            
            <form onSubmit={saveProfileSettings} className="settings-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  id="role"
                  name="role"
                  className="form-input"
                  value={profileForm.role}
                  onChange={handleProfileChange}
                  disabled // Role typically can't be changed by the user
                >
                  <option value="admin">Admin</option>
                  <option value="analyst">Security Analyst</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Save size={16} />
                  <span>{loading ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'password':
        return (
          <div className="settings-section">
            <h2>Change Password</h2>
            <p>Update your account password.</p>
            
            <form onSubmit={changePassword} className="settings-form">
              <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="form-input"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="form-input"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Lock size={16} />
                  <span>{loading ? 'Changing...' : 'Change Password'}</span>
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="settings-section">
            <h2>Notification Settings</h2>
            <p>Configure how you receive alerts and notifications.</p>
            
            <form onSubmit={saveNotificationSettings} className="settings-form">
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="emailAlerts"
                    name="emailAlerts"
                    checked={notificationSettings.emailAlerts}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="emailAlerts">
                    <span className="checkbox-label">Email Alerts</span>
                    <span className="checkbox-description">Receive notifications via email</span>
                  </label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="criticalVulnerabilities"
                    name="criticalVulnerabilities"
                    checked={notificationSettings.criticalVulnerabilities}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="criticalVulnerabilities">
                    <span className="checkbox-label">Critical Vulnerabilities</span>
                    <span className="checkbox-description">Get notified about critical security issues</span>
                  </label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="successfulAttacks"
                    name="successfulAttacks"
                    checked={notificationSettings.successfulAttacks}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="successfulAttacks">
                    <span className="checkbox-label">Successful Attacks</span>
                    <span className="checkbox-description">Get notified when attacks succeed</span>
                  </label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="systemUpdates"
                    name="systemUpdates"
                    checked={notificationSettings.systemUpdates}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="systemUpdates">
                    <span className="checkbox-label">System Updates</span>
                    <span className="checkbox-description">Get notified about platform updates</span>
                  </label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="dailyDigest"
                    name="dailyDigest"
                    checked={notificationSettings.dailyDigest}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="dailyDigest">
                    <span className="checkbox-label">Daily Digest</span>
                    <span className="checkbox-description">Receive a daily summary of activities</span>
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Bell size={16} />
                  <span>{loading ? 'Saving...' : 'Save Notification Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'security':
        return (
          <div className="settings-section">
            <h2>Security Settings</h2>
            <p>Configure security options for your account.</p>
            
            <form onSubmit={saveSecuritySettings} className="settings-form">
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    name="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onChange={handleSecurityChange}
                  />
                  <label htmlFor="twoFactorAuth">
                    <span className="checkbox-label">Two-Factor Authentication</span>
                    <span className="checkbox-description">Enable 2FA for enhanced security</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="sessionTimeout" className="form-label">Session Timeout (minutes)</label>
                <select
                  id="sessionTimeout"
                  name="sessionTimeout"
                  className="form-input"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecurityChange}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
              
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="ipRestriction"
                    name="ipRestriction"
                    checked={securitySettings.ipRestriction}
                    onChange={handleSecurityChange}
                  />
                  <label htmlFor="ipRestriction">
                    <span className="checkbox-label">IP Restriction</span>
                    <span className="checkbox-description">Limit access to specific IP addresses</span>
                  </label>
                </div>
              </div>
              
              {securitySettings.ipRestriction && (
                <div className="form-group">
                  <label htmlFor="allowedIPs" className="form-label">Allowed IP Addresses</label>
                  <textarea
                    id="allowedIPs"
                    name="allowedIPs"
                    className="form-input"
                    value={securitySettings.allowedIPs}
                    onChange={handleSecurityChange}
                    placeholder="Enter IP addresses, one per line"
                    rows={4}
                  ></textarea>
                  <p className="input-help">Enter one IP address or CIDR range per line (e.g., 192.168.1.0/24)</p>
                </div>
              )}
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Shield size={16} />
                  <span>{loading ? 'Saving...' : 'Save Security Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'importExport':
        return (
          <div className="settings-section">
            <h2>Import & Export Settings</h2>
            <p>Export your dashboard settings or import from a file.</p>
            
            <div className="export-section">
              <h3>Export Settings</h3>
              <form onSubmit={exportSettings} className="settings-form">
                <div className="form-group">
                  <label htmlFor="exportFormat" className="form-label">Export Format</label>
                  <select
                    id="exportFormat"
                    name="exportFormat"
                    className="form-input"
                    value={importExportSettings.exportFormat}
                    onChange={handleImportExportChange}
                  >
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                  </select>
                </div>
                
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="includeUserData"
                      name="includeUserData"
                      checked={importExportSettings.includeUserData}
                      onChange={handleImportExportChange}
                    />
                    <label htmlFor="includeUserData">
                      <span className="checkbox-label">Include User Data</span>
                      <span className="checkbox-description">Export personal settings and preferences</span>
                    </label>
                  </div>
                  
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="includeSystemSettings"
                      name="includeSystemSettings"
                      checked={importExportSettings.includeSystemSettings}
                      onChange={handleImportExportChange}
                    />
                    <label htmlFor="includeSystemSettings">
                      <span className="checkbox-label">Include System Settings</span>
                      <span className="checkbox-description">Export system configuration</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <Download size={16} />
                    <span>{loading ? 'Exporting...' : 'Export Settings'}</span>
                  </button>
                </div>
              </form>
            </div>
            
            <div className="import-section">
              <h3>Import Settings</h3>
              <div className="import-container">
                <p>Upload a previously exported settings file to restore your configuration.</p>
                <button className="btn" onClick={importSettings}>
                  <Upload size={16} />
                  <span>Import Settings</span>
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <ul className="settings-tabs">
            <li 
              className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabChange('profile')}
            >
              <User size={18} />
              <span>Profile</span>
            </li>
            <li 
              className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => handleTabChange('password')}
            >
              <Lock size={18} />
              <span>Password</span>
            </li>
            <li 
              className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => handleTabChange('notifications')}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </li>
            <li 
              className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => handleTabChange('security')}
            >
              <Shield size={18} />
              <span>Security</span>
            </li>
            <li 
              className={`settings-tab ${activeTab === 'importExport' ? 'active' : ''}`}
              onClick={() => handleTabChange('importExport')}
            >
              <Download size={18} />
              <span>Import/Export</span>
            </li>
          </ul>
        </div>
        
        <div className="settings-content card">
          {success && (
            <div className="success-alert">
              <p>{success}</p>
            </div>
          )}
          
          {error && (
            <div className="error-alert">
              <p>{error}</p>
            </div>
          )}
          
          {renderSettingsTab()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
