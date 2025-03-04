import React, { useState, useEffect } from 'react';
import { Filter, X, Check, RefreshCw, ChevronDown } from 'react-feather';
import { useDashboard } from '../../hooks/useDashboard';

const DashboardFilters = ({ models = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [availableModels, setAvailableModels] = useState(models);
  const {
    filters,
    isFilterChanged,
    handleTimeRangeChange,
    handleModelSelectionChange,
    applyFilters,
    resetFilters,
    refreshDashboard
  } = useDashboard();

  // Update available models when models prop changes
  useEffect(() => {
    setAvailableModels(models);
  }, [models]);

  // Toggle filters panel
  const toggleFilters = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle time range click
  const handleTimeRangeClick = (range) => {
    handleTimeRangeChange(range);
  };

  // Handle model checkbox change
  const handleModelCheckboxChange = (e, modelId) => {
    const isChecked = e.target.checked;
    
    handleModelSelectionChange(
      isChecked
        ? [...filters.selectedModels, modelId] 
        : filters.selectedModels.filter(id => id !== modelId)
    );
  };

  // Handle model select all change
  const handleSelectAllModels = (e) => {
    const isChecked = e.target.checked;
    
    if (isChecked) {
      handleModelSelectionChange(availableModels.map(model => model.id));
    } else {
      handleModelSelectionChange([]);
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    applyFilters();
    setIsExpanded(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    resetFilters();
  };

  // Get time range button class
  const getTimeRangeButtonClass = (range) => {
    return `time-range-btn ${filters.timeRange === range ? 'active' : ''}`;
  };

  // Check if all models are selected
  const areAllModelsSelected = () => {
    return availableModels.length > 0 && 
           availableModels.every(model => 
             filters.selectedModels.includes(model.id)
           );
  };

  // Check if some models are selected
  const areSomeModelsSelected = () => {
    return filters.selectedModels.length > 0 && 
           !areAllModelsSelected();
  };

  return (
    <div className="dashboard-filters-container">
      <div className="filters-header">
        <div className="filter-actions">
          <button
            className={`btn filter-toggle-btn ${isExpanded ? 'active' : ''}`}
            onClick={toggleFilters}
          >
            <Filter size={16} />
            <span>Filters</span>
            <ChevronDown size={14} className={`chevron ${isExpanded ? 'expanded' : ''}`} />
          </button>

          <div className="quick-time-filters">
            <button
              className={getTimeRangeButtonClass('24h')}
              onClick={() => handleTimeRangeClick('24h')}
            >
              24h
            </button>
            <button
              className={getTimeRangeButtonClass('7d')}
              onClick={() => handleTimeRangeClick('7d')}
            >
              7d
            </button>
            <button
              className={getTimeRangeButtonClass('30d')}
              onClick={() => handleTimeRangeClick('30d')}
            >
              30d
            </button>
          </div>
        </div>

        <button
          className="btn refresh-btn"
          onClick={refreshDashboard}
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {isExpanded && (
        <div className="filters-panel card">
          <div className="filters-content">
            <div className="time-range-section">
              <h3>Time Range</h3>
              <div className="time-range-options">
                <button
                  className={getTimeRangeButtonClass('24h')}
                  onClick={() => handleTimeRangeClick('24h')}
                >
                  Last 24 Hours
                </button>
                <button
                  className={getTimeRangeButtonClass('7d')}
                  onClick={() => handleTimeRangeClick('7d')}
                >
                  Last 7 Days
                </button>
                <button
                  className={getTimeRangeButtonClass('30d')}
                  onClick={() => handleTimeRangeClick('30d')}
                >
                  Last 30 Days
                </button>
                <button
                  className={getTimeRangeButtonClass('90d')}
                  onClick={() => handleTimeRangeClick('90d')}
                >
                  Last 90 Days
                </button>
              </div>
            </div>

            <div className="models-section">
              <div className="models-header">
                <h3>Models</h3>
                <label className="select-all-label">
                  <input
                    type="checkbox"
                    checked={areAllModelsSelected()}
                    onChange={handleSelectAllModels}
                    className="select-all-checkbox"
                  />
                  <span className="checkbox-label">Select All</span>
                </label>
              </div>

              <div className="models-grid">
                {availableModels.map(model => (
                  <div key={model.id} className="model-filter-item">
                    <label className="model-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.selectedModels.includes(model.id)}
                        onChange={(e) => handleModelCheckboxChange(e, model.id)}
                        className="model-checkbox"
                      />
                      <span className="checkbox-custom">
                        {filters.selectedModels.includes(model.id) && (
                          <Check size={12} />
                        )}
                      </span>
                      <div className="model-info">
                        <span className="model-name">{model.name}</span>
                        <span className="model-version">v{model.version}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="filters-footer">
            <button
              className="btn btn-outline"
              onClick={handleResetFilters}
            >
              <X size={14} />
              <span>Reset</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={handleApplyFilters}
              disabled={!isFilterChanged}
            >
              <Filter size={14} />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFilters;
