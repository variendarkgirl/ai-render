import React from 'react';
import { ArrowUp, ArrowDown } from 'react-feather';

const MetricCard = ({ title, value, icon, trend, accentColor = 'primary' }) => {
  // Dynamically import icon from react-feather
  const Icon = require('react-feather')[icon];
  
  // Determine trend display
  const renderTrend = () => {
    if (!trend) return null;
    
    const { value, direction } = trend;
    const TrendIcon = direction === 'up' ? ArrowUp : ArrowDown;
    const trendClass = direction === 'up' ? 'metric-trend-up' : 'metric-trend-down';
    
    return (
      <div className={`metric-trend ${trendClass}`}>
        <TrendIcon size={16} />
        <span>{value}% from last period</span>
      </div>
    );
  };

  return (
    <div className="card metric-card">
      <div className="metric-header" style={{ color: `var(--${accentColor})` }}>
        <h3 className="card-title">{title}</h3>
        {Icon && <Icon size={20} />}
      </div>
      <div 
        className="metric-value mono" 
        style={{ color: `var(--${accentColor})` }}
      >
        {value}
      </div>
      {renderTrend()}
    </div>
  );
};

export default MetricCard;
