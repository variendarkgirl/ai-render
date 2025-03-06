import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight } from 'react-feather';

const ModelComparisonTable = ({ data }) => {
  const [sortMetric, setSortMetric] = useState('attackResistance');
  const [sortDirection, setSortDirection] = useState('desc');
  
  if (!data || !data.models || !data.metrics) {
    return <div className="loading-state">No comparison data available</div>;
  }
  
  const { models, metrics, vulnerabilityCounts } = data;
  
  // Handle sort change
  const handleSort = (metric) => {
    if (metric === sortMetric) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortMetric(metric);
      setSortDirection('desc');
    }
  };
  
  // Get sort indicator for a metric
  const getSortIndicator = (metric) => {
    if (metric !== sortMetric) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp size={16} /> 
      : <ChevronDown size={16} />;
  };
  
  // Sort models based on current sort metric and direction
  const sortedModels = [...models].sort((a, b) => {
    // Find the metric values for both models
    const metricValues = metrics[sortMetric];
    
    if (!metricValues) return 0;
    
    const valueA = metricValues.find(m => m.modelId === a.id)?.score || 0;
    const valueB = metricValues.find(m => m.modelId === b.id)?.score || 0;
    
    return sortDirection === 'asc' 
      ? valueA - valueB 
      : valueB - valueA;
  });
  
  // Get metric value for a specific model and metric
  const getMetricValue = (modelId, metricName) => {
    return metrics[metricName]?.find(m => m.modelId === modelId)?.score || 0;
  };
  
  // Get vulnerability counts for a specific model
  const getVulnerabilityCounts = (modelId) => {
    return vulnerabilityCounts.find(vc => vc.modelId === modelId) || {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
  };
  
  // Render score cell with appropriate styling based on value
  const renderScoreCell = (score) => {
    let scoreClass = '';
    
    if (score >= 80) scoreClass = 'score-excellent';
    else if (score >= 70) scoreClass = 'score-good';
    else if (score >= 60) scoreClass = 'score-average';
    else scoreClass = 'score-poor';
    
    return (
      <div className={`score-cell ${scoreClass}`}>
        <span className="score-value">{score}</span>
      </div>
    );
  };
  
  // Render trend indicator
  const renderTrendIndicator = (value, isPositive) => {
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    const trendClass = isPositive ? 'trend-positive' : 'trend-negative';
    
    return (
      <div className={`trend-indicator ${trendClass}`}>
        <Icon size={14} />
        <span>{value}%</span>
      </div>
    );
  };
  
  // Render vulnerability counts for a model
  const renderVulnerabilityCounts = (modelId) => {
    const counts = getVulnerabilityCounts(modelId);
    
    return (
      <div className="vulnerability-counts">
        <div className="count-item count-critical">
          <span className="count-value">{counts.critical}</span>
          <span className="count-label">Critical</span>
        </div>
        <div className="count-item count-high">
          <span className="count-value">{counts.high}</span>
          <span className="count-label">High</span>
        </div>
        <div className="count-item count-medium">
          <span className="count-value">{counts.medium}</span>
          <span className="count-label">Medium</span>
        </div>
        <div className="count-item count-low">
          <span className="count-value">{counts.low}</span>
          <span className="count-label">Low</span>
        </div>
      </div>
    );
  };

  return (
    <div className="model-comparison-table">
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th 
              className={`sortable ${sortMetric === 'attackResistance' ? 'sorted' : ''}`}
              onClick={() => handleSort('attackResistance')}
            >
              <div className="th-content">
                <span>Attack Resistance</span>
                {getSortIndicator('attackResistance')}
              </div>
            </th>
            <th 
              className={`sortable ${sortMetric === 'promptInjection' ? 'sorted' : ''}`}
              onClick={() => handleSort('promptInjection')}
            >
              <div className="th-content">
                <span>Prompt Injection</span>
                {getSortIndicator('promptInjection')}
              </div>
            </th>
            <th 
              className={`sortable ${sortMetric === 'jailbreakResistance' ? 'sorted' : ''}`}
              onClick={() => handleSort('jailbreakResistance')}
            >
              <div className="th-content">
                <span>Jailbreak Resistance</span>
                {getSortIndicator('jailbreakResistance')}
              </div>
            </th>
            <th 
              className={`sortable ${sortMetric === 'dataProtection' ? 'sorted' : ''}`}
              onClick={() => handleSort('dataProtection')}
            >
              <div className="th-content">
                <span>Data Protection</span>
                {getSortIndicator('dataProtection')}
              </div>
            </th>
            <th 
              className={`sortable ${sortMetric === 'harmfulContentFiltering' ? 'sorted' : ''}`}
              onClick={() => handleSort('harmfulContentFiltering')}
            >
              <div className="th-content">
                <span>Harmful Content Filtering</span>
                {getSortIndicator('harmfulContentFiltering')}
              </div>
            </th>
            <th>Vulnerabilities</th>
          </tr>
        </thead>
        <tbody>
          {sortedModels.map(model => (
            <tr key={model.id}>
              <td className="model-cell">
                <div className="model-info">
                  <div className="model-name">{model.name}</div>
                  <div className="model-version">v{model.version}</div>
                </div>
              </td>
              <td>
                {renderScoreCell(getMetricValue(model.id, 'attackResistance'))}
                {renderTrendIndicator(2.5, true)}
              </td>
              <td>
                {renderScoreCell(getMetricValue(model.id, 'promptInjection'))}
                {renderTrendIndicator(1.8, true)}
              </td>
              <td>
                {renderScoreCell(getMetricValue(model.id, 'jailbreakResistance'))}
                {renderTrendIndicator(0.7, model.id !== 'model-c')}
              </td>
              <td>
                {renderScoreCell(getMetricValue(model.id, 'dataProtection'))}
                {renderTrendIndicator(3.2, true)}
              </td>
              <td>
                {renderScoreCell(getMetricValue(model.id, 'harmfulContentFiltering'))}
                {renderTrendIndicator(1.5, model.id !== 'model-a')}
              </td>
              <td>
                {renderVulnerabilityCounts(model.id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModelComparisonTable;
