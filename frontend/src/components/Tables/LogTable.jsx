import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, AlertTriangle, Check, X } from 'react-feather';

const LogTable = ({ logs, onViewDetails }) => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRows, setExpandedRows] = useState({});
  
  // Handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get sort icon
  const getSortIcon = (field) => {
    if (field !== sortField) return <ChevronDown size={16} opacity={0.3} />;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };
  
  // Toggle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Sort logs
  const sortedLogs = [...logs].sort((a, b) => {
    let compareA = a[sortField];
    let compareB = b[sortField];
    
    // Handle different types of fields
    if (sortField === 'timestamp') {
      compareA = new Date(compareA);
      compareB = new Date(compareB);
    }
    
    if (compareA < compareB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (compareA > compareB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Get status indicator for log
  const getStatusIndicator = (log) => {
    if (log.blocked) {
      return <span className="status-indicator status-normal"></span>;
    }
    
    if (log.success) {
      return <span className="status-indicator status-critical"></span>;
    }
    
    return <span className="status-indicator status-warning"></span>;
  };
  
  // Get status text for log
  const getStatusText = (log) => {
    if (log.blocked) {
      return <span className="log-status-blocked">Blocked</span>;
    }
    
    if (log.success) {
      return <span className="log-status-success">Success</span>;
    }
    
    return <span className="log-status-failed">Failed</span>;
  };
  
  // Get status icon for log
  const getStatusIcon = (log) => {
    if (log.blocked) {
      return <X size={16} className="status-icon blocked" />;
    }
    
    if (log.success) {
      return <Check size={16} className="status-icon success" />;
    }
    
    return <AlertTriangle size={16} className="status-icon warning" />;
  };
  
  // Truncate text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="log-table-container">
      <table className="log-table">
        <thead>
          <tr>
            <th className="expand-column"></th>
            <th 
              className={`sortable ${sortField === 'timestamp' ? 'active' : ''}`}
              onClick={() => handleSort('timestamp')}
            >
              <div className="th-content">
                Timestamp
                {getSortIcon('timestamp')}
              </div>
            </th>
            <th 
              className={`sortable ${sortField === 'type' ? 'active' : ''}`}
              onClick={() => handleSort('type')}
            >
              <div className="th-content">
                Attack Type
                {getSortIcon('type')}
              </div>
            </th>
            <th 
              className={`sortable ${sortField === 'modelId' ? 'active' : ''}`}
              onClick={() => handleSort('modelId')}
            >
              <div className="th-content">
                Model
                {getSortIcon('modelId')}
              </div>
            </th>
            <th className="truncate-column">Prompt</th>
            <th 
              className={`sortable ${sortField === 'success' ? 'active' : ''}`}
              onClick={() => handleSort('success')}
            >
              <div className="th-content">
                Status
                {getSortIcon('success')}
              </div>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedLogs.map(log => (
            <React.Fragment key={log.id}>
              <tr className={expandedRows[log.id] ? 'expanded' : ''}>
                <td className="expand-cell">
                  <button 
                    className="expand-button"
                    onClick={() => toggleRowExpansion(log.id)}
                  >
                    {expandedRows[log.id] ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </button>
                </td>
                <td className="timestamp-cell mono">{formatTimestamp(log.timestamp)}</td>
                <td className="type-cell">
                  <div className="type-badge">{log.type}</div>
                </td>
                <td>{log.modelName || log.modelId}</td>
                <td className="truncate-cell" title={log.prompt}>
                  {truncateText(log.prompt)}
                </td>
                <td className="status-cell">
                  <div className="status-display">
                    {getStatusIcon(log)}
                    {getStatusText(log)}
                  </div>
                </td>
                <td className="action-cell">
                  <button 
                    className="btn btn-small"
                    onClick={() => onViewDetails(log.id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
              {expandedRows[log.id] && (
                <tr className="expanded-row">
                  <td colSpan="7">
                    <div className="expanded-content">
                      <div className="expanded-section">
                        <h4>Attack Details</h4>
                        <div className="detail-grid">
                          <div className="detail-item">
                            <div className="detail-label">ID</div>
                            <div className="detail-value mono">{log.id}</div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-label">User Agent</div>
                            <div className="detail-value mono">{log.userAgent || 'N/A'}</div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-label">Source</div>
                            <div className="detail-value">{log.source || 'API'}</div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-label">Severity</div>
                            <div className="detail-value">
                              <span className={`severity-badge severity-${log.severity || 'medium'}`}>
                                {(log.severity || 'medium').toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="expanded-section">
                        <h4>Full Prompt</h4>
                        <div className="prompt-content mono">
                          {log.prompt}
                        </div>
                      </div>
                      
                      {log.response && (
                        <div className="expanded-section">
                          <h4>Model Response</h4>
                          <div className="response-content">
                            {truncateText(log.response, 200)}
                            {log.response.length > 200 && (
                              <button 
                                className="btn btn-small view-full-btn"
                                onClick={() => onViewDetails(log.id)}
                              >
                                View Full Response
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
