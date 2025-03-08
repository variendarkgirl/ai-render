
const logger = require('../../utils/logger');
const metricService = require('../../services/metric.service');
const aggregationService = require('../../services/aggregation.service');

/**
 * Get dashboard metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDashboardMetrics = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { timeRange, modelIds } = req.query;
    
    // Get dashboard metrics data from service
    const dashboardMetrics = await metricService.getDashboardMetrics(timeRange, modelIds);
    
    res.status(200).json(dashboardMetrics);
  } catch (error) {
    logger.error(`Error in getDashboardMetrics: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving dashboard metrics' });
  }
};

/**
 * Get vulnerability metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getVulnerabilityMetrics = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { timeRange, modelIds, vulnerabilityTypes } = req.query;
    
    // Get vulnerability metrics data from service
    const vulnerabilityMetrics = await metricService.getVulnerabilityMetrics(
      timeRange, 
      modelIds, 
      vulnerabilityTypes
    );
    
    res.status(200).json(vulnerabilityMetrics);
  } catch (error) {
    logger.error(`Error in getVulnerabilityMetrics: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving vulnerability metrics' });
  }
};

/**
 * Get model comparison metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getModelComparisonMetrics = async (req, res) => {
  try {
    // Extract parameters from query
    const { modelIds, timeRange, metricTypes } = req.query;
    
    // Parse model IDs if provided as a comma-separated string
    const parsedModelIds = modelIds ? modelIds.split(',') : [];
    
    if (!parsedModelIds.length) {
      return res.status(400).json({ message: 'Model IDs are required for comparison' });
    }
    
    // Get model comparison metrics from service
    const comparisonMetrics = await metricService.getModelComparisonMetrics(
      parsedModelIds, 
      timeRange, 
      metricTypes
    );
    
    res.status(200).json(comparisonMetrics);
  } catch (error) {
    logger.error(`Error in getModelComparisonMetrics: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving model comparison metrics' });
  }
};

/**
 * Get log metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLogMetrics = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { startDate, endDate, modelIds, vulnerabilityTypes, status } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    
    // Convert string dates to Date objects
    const timeRange = {
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    };
    
    // Verify dates are valid
    if (isNaN(timeRange.startDate) || isNaN(timeRange.endDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Parse additional filters
    const filters = {
      modelIds: modelIds ? modelIds.split(',') : undefined,
      vulnerabilityTypes: vulnerabilityTypes ? vulnerabilityTypes.split(',') : undefined,
      status
    };
    
    // Get log metrics from service
    const logMetrics = await metricService.getLogMetrics(timeRange, filters);
    
    res.status(200).json(logMetrics);
  } catch (error) {
    logger.error(`Error in getLogMetrics: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving log metrics' });
  }
};

/**
 * Get real-time metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRealTimeMetrics = async (req, res) => {
  try {
    // Extract parameters from query
    const { modelIds } = req.query;
    
    // Parse model IDs if provided
    const parsedModelIds = modelIds ? modelIds.split(',') : undefined;
    
    // Get real-time metrics from service
    const realTimeMetrics = await metricService.getRealTimeMetrics(parsedModelIds);
    
    res.status(200).json(realTimeMetrics);
  } catch (error) {
    logger.error(`Error in getRealTimeMetrics: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving real-time metrics' });
  }
};

/**
 * Export metrics data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.exportMetricsData = async (req, res) => {
  try {
    // Extract parameters from request body
    const { timeRange, filters, exportFormat, metricTypes } = req.body;
    
    if (!timeRange || !exportFormat) {
      return res.status(400).json({ message: 'Time range and export format are required' });
    }
    
    // Get exported data from service
    const exportedData = await aggregationService.exportMetricsData(
      timeRange,
      filters,
      exportFormat,
      metricTypes
    );
    
    // Set appropriate content type based on export format
    const contentType = exportFormat === 'csv' 
      ? 'text/csv' 
      : exportFormat === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/json';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=metrics-export.${exportFormat}`);
    
    res.status(200).send(exportedData);
  } catch (error) {
    logger.error(`Error in exportMetricsData: ${error.message}`);
    res.status(500).json({ message: 'Server error exporting metrics data' });
  }
};
