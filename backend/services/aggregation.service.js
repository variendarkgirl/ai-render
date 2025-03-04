const Log = require('../api/models/log.model');
const Metric = require('../api/models/metric.model');
const Model = require('../api/models/model.model');
const logger = require('../utils/logger');

/**
 * Generate and save metrics based on logs
 * @param {Object} timeRange - Time range for aggregation
 * @returns {Object} Generated metrics
 */
exports.generateMetrics = async (timeRange) => {
  try {
    const { startDate, endDate } = timeRange;
    
    // Validate time range
    if (!startDate || !endDate) {
      throw new Error('Start and end dates are required');
    }
    
    // Convert string dates to Date objects if needed
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    // Create metrics for each model
    const models = await Model.find({ status: { $ne: 'archived' } });
    const generatedMetrics = [];
    
    // Process each model
    for (const model of models) {
      const modelMetrics = await generateModelMetrics(model.modelId, { start, end });
      generatedMetrics.push(...modelMetrics);
    }
    
    // Generate overall metrics (not model-specific)
    const overallMetrics = await generateOverallMetrics({ start, end });
    generatedMetrics.push(...overallMetrics);
    
    // Save all metrics to database
    for (const metricData of generatedMetrics) {
      const metric = new Metric({
        ...metricData,
        timeRange: { start, end }
      });
      
      await metric.save();
    }
    
    return generatedMetrics;
  } catch (error) {
    logger.error(`Error generating metrics: ${error.message}`);
    throw error;
  }
};

/**
 * Generate metrics for a specific model
 * @param {String} modelId - Model ID
 * @param {Object} timeRange - Time range for aggregation
 * @returns {Array} Generated metrics
 */
const generateModelMetrics = async (modelId, timeRange) => {
  try {
    const { start, end } = timeRange;
    const metrics = [];
    
    // Base query for this model and time range
    const baseQuery = {
      modelId,
      timestamp: { $gte: start, $lte: end }
    };
    
    // Total attacks metric
    const totalAttacks = await Log.countDocuments(baseQuery);
    metrics.push({
      metricName: 'totalAttacks',
      metricType: 'attack',
      modelId,
      value: totalAttacks,
      aggregationType: 'count'
    });
    
    // Successful attacks metric
    const successfulAttacks = await Log.countDocuments({
      ...baseQuery,
      success: true
    });
    metrics.push({
      metricName: 'successfulAttacks',
      metricType: 'attack',
      modelId,
      value: successfulAttacks,
      aggregationType: 'count'
    });
    
    // Success rate metric
    const successRate = totalAttacks > 0 ? (successfulAttacks / totalAttacks) * 100 : 0;
    metrics.push({
      metricName: 'successRate',
      metricType: 'performance',
      modelId,
      value: successRate,
      aggregationType: 'average'
    });
    
    // Attack type distribution
    const attackTypeDistribution = await Log.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1
        }
      }
    ]);
    metrics.push({
      metricName: 'attackTypeDistribution',
      metricType: 'attack',
      modelId,
      value: attackTypeDistribution,
      aggregationType: 'count'
    });
    
    // Vulnerability counts by severity
    const vulnerabilityCountsBySeverity = await Log.aggregate([
      { 
        $match: {
          ...baseQuery,
          success: true
        }
      },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          severity: '$_id',
          count: 1
        }
      }
    ]);
    metrics.push({
      metricName: 'vulnerabilityCountsBySeverity',
      metricType: 'vulnerability',
      modelId,
      value: vulnerabilityCountsBySeverity,
      aggregationType: 'count'
    });
    
    return metrics;
  } catch (error) {
    logger.error(`Error generating model metrics: ${error.message}`);
    throw error;
  }
};

/**
 * Generate overall metrics (not model-specific)
 * @param {Object} timeRange - Time range for aggregation
 * @returns {Array} Generated metrics
 */
const generateOverallMetrics = async (timeRange) => {
  try {
    const { start, end } = timeRange;
    const metrics = [];
    
    // Base query for this time range
    const baseQuery = {
      timestamp: { $gte: start, $lte: end }
    };
    
    // Total attacks metric
    const totalAttacks = await Log.countDocuments(baseQuery);
    metrics.push({
      metricName: 'totalAttacks',
      metricType: 'attack',
      value: totalAttacks,
      aggregationType: 'count'
    });
    
    // Successful attacks metric
    const successfulAttacks = await Log.countDocuments({
      ...baseQuery,
      success: true
    });
    metrics.push({
      metricName: 'successfulAttacks',
      metricType: 'attack',
      value: successfulAttacks,
      aggregationType: 'count'
    });
    
    // Success rate metric
    const successRate = totalAttacks > 0 ? (successfulAttacks / totalAttacks) * 100 : 0;
    metrics.push({
      metricName: 'successRate',
      metricType: 'performance',
      value: successRate,
      aggregationType: 'average'
    });
    
    // Attack timeline (grouped by hour)
    const attackTimeline = await Log.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
            hour: { $hour: '$timestamp' }
          },
          attemptCount: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } },
      {
        $project: {
          _id: 0,
          timestamp: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
              hour: '$_id.hour'
            }
          },
          attemptCount: 1,
          successCount: 1
        }
      }
    ]);
    metrics.push({
      metricName: 'attackTimeline',
      metricType: 'attack',
      value: attackTimeline,
      aggregationType: 'count'
    });
    
    // Attack distribution by type
    const attackDistribution = await Log.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: '$count'
        }
      }
    ]);
    metrics.push({
      metricName: 'attackDistribution',
      metricType: 'attack',
      value: attackDistribution,
      aggregationType: 'count'
    });
    
    // Vulnerability data
    const vulnerabilityData = await Log.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
          },
          severityCounts: {
            $push: '$severity'
          }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
          successRate: {
            $multiply: [
              { $divide: ['$successCount', { $max: ['$count', 1] }] },
              100
            ]
          },
          severity: {
            $cond: {
              if: { $gt: ['$successCount', 0] },
              then: 'critical',
              else: {
                $cond: {
                  if: { $gt: [{ $size: '$severityCounts' }, 0] },
                  then: { $arrayElemAt: ['$severityCounts', 0] },
                  else: 'medium'
                }
              }
            }
          }
        }
      }
    ]);
    metrics.push({
      metricName: 'vulnerabilityData',
      metricType: 'vulnerability',
      value: vulnerabilityData,
      aggregationType: 'count'
    });
    
    // Mean time to detect (in hours)
    // This would typically involve additional data like detection timestamps
    // For now, we'll use a mock value
    metrics.push({
      metricName: 'meanTimeToDetect',
      metricType: 'performance',
      value: 3.2, // Mock value
      aggregationType: 'average'
    });
    
    return metrics;
  } catch (error) {
    logger.error(`Error generating overall metrics: ${error.message}`);
    throw error;
  }
};

/**
 * Get metrics for dashboard
 * @param {Object} filters - Filter criteria
 * @returns {Object} Dashboard metrics
 */
exports.getDashboardMetrics = async (filters = {}) => {
  try {
    const { timeRange, modelIds } = filters;
    
    // Define time range
    let startDate, endDate;
    if (timeRange) {
      endDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
      }
    } else {
      // Default to last 24 hours
      endDate = new Date();
      startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // Prepare filter for metrics queries
    const metricFilter = {
      'timeRange.start': { $lte: startDate },
      'timeRange.end': { $gte: endDate }
    };
    
    if (modelIds) {
      if (Array.isArray(modelIds)) {
        metricFilter.modelId = { $in: modelIds };
      } else {
        metricFilter.modelId = modelIds;
      }
    }
    
    // Try to get metrics from stored metrics first
    // If not available, generate new metrics
    
    // Check if we have recent metrics
    const mostRecentMetric = await Metric.findOne({
      metricName: 'totalAttacks',
      modelId: { $exists: false } // Overall metrics
    }).sort({ 'timeRange.end': -1 });
    
    // If we have recent metrics that cover our time range, use them
    if (mostRecentMetric && 
        mostRecentMetric.timeRange.start <= startDate && 
        mostRecentMetric.timeRange.end >= endDate) {
      
      return await getStoredDashboardMetrics(metricFilter);
    }
    
    // Otherwise, generate new metrics
    await exports.generateMetrics({ startDate, endDate });
    
    // Get the newly generated metrics
    return await getStoredDashboardMetrics(metricFilter);
  } catch (error) {
    logger.error(`Error getting dashboard metrics: ${error.message}`);
    throw error;
  }
};

/**
 * Get stored dashboard metrics
 * @param {Object} filter - Filter criteria for metrics
 * @returns {Object} Dashboard metrics
 */
const getStoredDashboardMetrics = async (filter) => {
  try {
    // Get total attacks
    const totalAttacksMetric = await Metric.findOne({
      ...filter,
      metricName: 'totalAttacks',
      modelId: { $exists: false }
    }).sort({ 'timeRange.end': -1 });
    
    // Get successful attacks
    const successfulAttacksMetric = await Metric.findOne({
      ...filter,
      metricName: 'successfulAttacks',
      modelId: { $exists: false }
    }).sort({ 'timeRange.end': -1 });
    
    // Get attack distribution
    const attackDistributionMetric = await Metric.findOne({
      ...filter,
      metricName: 'attackDistribution',
      modelId: { $exists: false }
    }).sort({ 'timeRange.end': -1 });
    
    // Get attack timeline
    const attackTimelineMetric = await Metric.findOne({
      ...filter,
      metricName: 'attackTimeline',
      modelId: { $exists: false }
    }).sort({ 'timeRange.end': -1 });
    
    // Get vulnerability data
    const vulnerabilityDataMetric = await Metric.findOne({
      ...filter,
      metricName: 'vulnerabilityData',
      modelId: { $exists: false }
    }).sort({ 'timeRange.end': -1 });
    
    // Get mean time to detect
    const meanTimeToDetectMetric = await Metric.findOne({
      ...filter,
      metricName: 'meanTimeToDetect',
      modelId: { $exists: false }
    }).sort({ 'timeRange.end': -1 });
    
    // Count models covered in the metrics
    const modelsCovered = await Model.countDocuments({
      status: 'active'
    });
    
    // Count critical issues (successful attacks with critical severity)
    const criticalIssues = await Log.countDocuments({
      success: true,
      severity: 'critical',
      timestamp: {
        $gte: filter['timeRange.start'],
        $lte: filter['timeRange.end']
      }
    });
    
    // Combine metrics into dashboard data
    return {
      totalAttacks: totalAttacksMetric?.value || 0,
      successfulAttacks: successfulAttacksMetric?.value || 0,
      vulnerabilities: vulnerabilityDataMetric?.value.length || 0,
      meanTimeToDetect: meanTimeToDetectMetric?.value || 0,
      modelsCovered,
      criticalIssues,
      attackDistribution: attackDistributionMetric?.value || [],
      timelineData: attackTimelineMetric?.value || [],
      vulnerabilityData: vulnerabilityDataMetric?.value || []
    };
  } catch (error) {
    logger.error(`Error getting stored dashboard metrics: ${error.message}`);
    throw error;
  }
};

/**
 * Export metrics data in various formats
 * @param {Object} timeRange - Time range for data export
 * @param {Object} filters - Additional filters
 * @param {String} exportFormat - Format for export (json, csv, excel)
 * @param {Array} metricTypes - Types of metrics to include
 * @returns {Buffer|String} Exported data
 */
exports.exportMetricsData = async (timeRange, filters = {}, exportFormat = 'json', metricTypes = []) => {
  try {
    // Define time range
    const { startDate, endDate } = timeRange;
    
    // Validate time range
    if (!startDate || !endDate) {
      throw new Error('Start and end dates are required');
    }
    
    // Convert string dates to Date objects if needed
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    // Prepare query
    const query = {
      timestamp: { $gte: start, $lte: end }
    };
    
    // Add modelId filter if provided
    if (filters.modelId) {
      if (Array.isArray(filters.modelId)) {
        query.modelId = { $in: filters.modelId };
      } else {
        query.modelId = filters.modelId;
      }
    }
    
    // Add type filter if provided
    if (filters.type) {
      if (Array.isArray(filters.type)) {
        query.type = { $in: filters.type };
      } else {
        query.type = filters.type;
      }
    }
    
    // Get logs based on filters
    const logs = await Log.find(query).sort({ timestamp: -1 });
    
    // Aggregate logs into metrics
    const metrics = {
      summary: {
        timeRange: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        totalLogs: logs.length,
        successfulAttacks: logs.filter(log => log.success).length,
        blockedAttacks: logs.filter(log => log.blocked).length
      },
      attackTypes: {},
      modelPerformance: {},
      severityDistribution: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      timeline: {}
    };
    
    // Process logs to build metrics
    logs.forEach(log => {
      // Attack types
      if (!metrics.attackTypes[log.type]) {
        metrics.attackTypes[log.type] = { total: 0, successful: 0 };
      }
      metrics.attackTypes[log.type].total++;
      if (log.success) {
        metrics.attackTypes[log.type].successful++;
      }
      
      // Model performance
      if (log.modelId) {
        if (!metrics.modelPerformance[log.modelId]) {
          metrics.modelPerformance[log.modelId] = {
            total: 0,
            successful: 0,
            blocked: 0
          };
        }
        metrics.modelPerformance[log.modelId].total++;
        if (log.success) {
          metrics.modelPerformance[log.modelId].successful++;
        }
        if (log.blocked) {
          metrics.modelPerformance[log.modelId].blocked++;
        }
      }
      
      // Severity distribution
      if (log.severity) {
        metrics.severityDistribution[log.severity]++;
      }
      
      // Timeline
      const dateKey = log.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!metrics.timeline[dateKey]) {
        metrics.timeline[dateKey] = { total: 0, successful: 0 };
      }
      metrics.timeline[dateKey].total++;
      if (log.success) {
        metrics.timeline[dateKey].successful++;
      }
    });
    
    // Transform data based on export format
    switch (exportFormat) {
      case 'csv':
        // Convert to CSV format
        return convertMetricsToCSV(metrics);
        
      case 'excel':
        // For now, we'll use CSV as a placeholder
        // In a real implementation, you would use a library like exceljs
        return convertMetricsToCSV(metrics);
        
      case 'json':
      default:
        // Return JSON format
        return JSON.stringify(metrics, null, 2);
    }
  } catch (error) {
    logger.error(`Error exporting metrics data: ${error.message}`);
    throw error;
  }
};

/**
 * Convert metrics to CSV format
 * @param {Object} metrics - Metrics data
 * @returns {String} CSV data
 */
const convertMetricsToCSV = (metrics) => {
  let csv = '';
  
  // Summary section
  csv += 'Summary\n';
  csv += `Time Range,${metrics.summary.timeRange.start} to ${metrics.summary.timeRange.end}\n`;
  csv += `Total Logs,${metrics.summary.totalLogs}\n`;
  csv += `Successful Attacks,${metrics.summary.successfulAttacks}\n`;
  csv += `Blocked Attacks,${metrics.summary.blockedAttacks}\n\n`;
  
  // Attack types section
  csv += 'Attack Types\n';
  csv += 'Type,Total,Successful,Success Rate\n';
  for (const [type, data] of Object.entries(metrics.attackTypes)) {
    const successRate = data.total > 0 ? (data.successful / data.total * 100).toFixed(2) : '0.00';
    csv += `${type},${data.total},${data.successful},${successRate}%\n`;
  }
  csv += '\n';
  
  // Model performance section
  csv += 'Model Performance\n';
  csv += 'Model ID,Total,Successful,Blocked,Success Rate\n';
  for (const [modelId, data] of Object.entries(metrics.modelPerformance)) {
    const successRate = data.total > 0 ? (data.successful / data.total * 100).toFixed(2) : '0.00';
    csv += `${modelId},${data.total},${data.successful},${data.blocked},${successRate}%\n`;
  }
  csv += '\n';
  
  // Severity distribution
  csv += 'Severity Distribution\n';
  csv += 'Severity,Count\n';
  for (const [severity, count] of Object.entries(metrics.severityDistribution)) {
    csv += `${severity},${count}\n`;
  }
  csv += '\n';
  
  // Timeline
  csv += 'Timeline\n';
  csv += 'Date,Total,Successful\n';
  for (const [date, data] of Object.entries(metrics.timeline)) {
    csv += `${date},${data.total},${data.successful}\n`;
  }
  
  return csv;
};
