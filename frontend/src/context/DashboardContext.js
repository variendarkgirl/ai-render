import React, { createContext, useState, useEffect } from 'react';
import { fetchDashboardMetrics, fetchRealTimeMetrics } from '../services/metricsService';

// Create context
export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [metrics, setMetrics] = useState({
    totalAttacks: 0,
    successfulAttacks: 0,
    vulnerabilities: 0,
    meanTimeToDetect: 0,
    modelsCovered: 0,
    criticalIssues: 0,
    attackDistribution: [],
    timelineData: [],
    vulnerabilityData: []
  });
  
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedModels, setSelectedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  
  // Load initial dashboard data
  useEffect(() => {
    loadDashboardData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(loadRealTimeData, 30000);
    
    return () => clearInterval(intervalId);
  }, [timeRange, selectedModels]);
  
  // Load dashboard metrics
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const filters = {
        timeRange,
        ...(selectedModels.length > 0 && { modelIds: selectedModels })
      };
      
      const data = await fetchDashboardMetrics(filters);
      setMetrics(data);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load real-time metrics
  const loadRealTimeData = async () => {
    try {
      const data = await fetchRealTimeMetrics();
      setRealTimeData(data);
    } catch (err) {
      console.error('Error loading real-time metrics:', err);
      // Don't set error state for real-time updates to avoid disrupting the UI
    }
  };
  
  // Update time range
  const updateTimeRange = (range) => {
    setTimeRange(range);
  };
  
  // Update selected models
  const updateSelectedModels = (models) => {
    setSelectedModels(models);
  };
  
  // Refresh dashboard data
  const refreshDashboard = () => {
    loadDashboardData();
    loadRealTimeData();
  };
  
  // Context value
  const value = {
    metrics,
    realTimeData,
    timeRange,
    selectedModels,
    loading,
    error,
    updateTimeRange,
    updateSelectedModels,
    refreshDashboard
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
