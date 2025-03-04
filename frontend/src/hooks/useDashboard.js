import { useContext, useEffect, useState } from 'react';
import DashboardContext from '../context/DashboardContext';

/**
 * Custom hook for using dashboard data and functionality
 * @returns {Object} Dashboard data, state, and functions
 */
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  const [localFilters, setLocalFilters] = useState({
    timeRange: context.timeRange || '24h',
    selectedModels: context.selectedModels || []
  });
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  // When context values change, update local filters
  useEffect(() => {
    if (context.timeRange !== localFilters.timeRange || 
        JSON.stringify(context.selectedModels) !== JSON.stringify(localFilters.selectedModels)) {
      setLocalFilters({
        timeRange: context.timeRange,
        selectedModels: context.selectedModels
      });
      setIsFilterChanged(false);
    }
  }, [context.timeRange, context.selectedModels]);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setLocalFilters(prev => ({
      ...prev,
      timeRange: range
    }));
    setIsFilterChanged(true);
  };

  // Handle model selection change
  const handleModelSelectionChange = (models) => {
    setLocalFilters(prev => ({
      ...prev,
      selectedModels: models
    }));
    setIsFilterChanged(true);
  };

  // Toggle model selection
  const toggleModelSelection = (modelId) => {
    setLocalFilters(prev => {
      const selectedModels = [...prev.selectedModels];
      const index = selectedModels.indexOf(modelId);
      
      if (index === -1) {
        selectedModels.push(modelId);
      } else {
        selectedModels.splice(index, 1);
      }
      
      return {
        ...prev,
        selectedModels
      };
    });
    setIsFilterChanged(true);
  };

  // Apply filters
  const applyFilters = () => {
    context.updateTimeRange(localFilters.timeRange);
    context.updateSelectedModels(localFilters.selectedModels);
    setIsFilterChanged(false);
  };

  // Reset filters
  const resetFilters = () => {
    setLocalFilters({
      timeRange: '24h',
      selectedModels: []
    });
    setIsFilterChanged(true);
  };

  return {
    // Original context values
    metrics: context.metrics,
    realTimeData: context.realTimeData,
    loading: context.loading,
    error: context.error,
    refreshDashboard: context.refreshDashboard,
    
    // Local state for filter management
    filters: localFilters,
    isFilterChanged,
    
    // Filter management functions
    handleTimeRangeChange,
    handleModelSelectionChange,
    toggleModelSelection,
    applyFilters,
    resetFilters
  };
};

export default useDashboard;
