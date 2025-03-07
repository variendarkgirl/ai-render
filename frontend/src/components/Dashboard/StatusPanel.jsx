import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Clock, Activity } from 'react-feather';

const StatusPanel = ({ criticalIssues }) => {
  const [threatLevel, setThreatLevel] = useState('elevated');
  const [lastScan, setLastScan] = useState(new Date().toISOString());
  const [uptime, setUptime] = useState(0);
  const [statusMessages, setStatusMessages] = useState([]);
  
  // Calculate threat level based on critical issues
  useEffect(() => {
    if (criticalIssues === 0) {
      setThreatLevel('normal');
    } else if (criticalIssues <= 2) {
      setThreatLevel('elevated');
    } else {
      setThreatLevel('critical');
    }
  }, [criticalIssues]);
  
  // Simulate uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate simulated status messages
  useEffect(() => {
    const messages = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        message: 'Prompt injection attempt detected and blocked',
        type: 'warning'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        message: 'System scan completed. 2 new vulnerabilities identified',
        type: 'info'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
        message: 'Critical vulnerability in Model A requires attention',
        type: 'critical'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
        message: 'New red team attack vector added to monitoring',
        type: 'info'
      }
    ];
    
    setStatusMessages(messages);
  }, []);
  
  // Format time display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Format timestamp for messages
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours}h ago`;
    }
  };
  
  // Get status indicator class based on threat level
  const getStatusClass = (level) => {
    switch (level) {
      case 'critical':
        return 'status-critical';
      case 'elevated':
        return 'status-warning';
      case 'normal':
        return 'status-normal';
      default:
        return 'status-normal';
    }
  };
  
  // Get icon for message type
  const getMessageIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={16} className="message-icon text-danger" />;
      case 'warning':
        return <AlertTriangle size={16} className="message-icon text-warning" />;
      case 'info':
        return <Activity size={16} className="message-icon text-info" />;
      default:
        return <Activity size={16} className="message-icon" />;
    }
  };

  return (
    <div className="card status-panel">
      <h2 className="card-title">System Status</h2>
      
      <div className="status-header">
        <div className="threat-level">
          <div className="status-label">THREAT LEVEL</div>
          <div className="threat-indicator">
            <span className={`status-indicator ${getStatusClass(threatLevel)} pulse`}></span>
            <span className="threat-level-text">
              {threatLevel.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="status-metrics">
          <div className="status-metric">
            <Shield size={16} />
            <span className="metric-label">Critical Issues</span>
            <span className="metric-value">{criticalIssues}</span>
          </div>
          
          <div className="status-metric">
            <Clock size={16} />
            <span className="metric-label">Last Scan</span>
            <span className="metric-value mono">
              {new Date(lastScan).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="status-metric">
            <Activity size={16} />
            <span className="metric-label">Uptime</span>
            <span className="metric-value mono">{formatTime(uptime)}</span>
          </div>
        </div>
      </div>
      
      <div className="status-messages">
        <h3 className="section-title">Recent Events</h3>
        <div className="message-list">
          {statusMessages.map(message => (
            <div key={message.id} className={`status-message status-${message.type}`}>
              <div className="message-header">
                {getMessageIcon(message.type)}
                <span className="message-time mono">
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>
              <div className="message-content">
                {message.message}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="status-footer">
        <button className="btn">View All Events</button>
      </div>
    </div>
  );
};

export default StatusPanel;
