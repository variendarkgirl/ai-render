const Log = require('../api/models/log.model');
const Metric = require('../api/models/metric.model');
const Model = require('../api/models/model.model');
const logger = require('../utils/logger');

/**
 * Get dashboard metrics
 * @param {String} timeRange - Time range for the metrics (optional)
 * @param {Array<String>} modelIds - Array of model IDs to filter by (optional)
 * @returns {Object} Dashboard metrics data
 */
exports.getDashboardMetrics = async (timeRange, modelIds) => {
  try {
    // In a real implementation, this would query the database for metrics
    // For now, we'll return mock data similar to the frontend mock
    
    // Convert timeRange string to date objects if provided
    let startDate, endDate;
    if (timeRange) {
      switch (timeRange) {
        case '24h':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }
      endDate = new Date();
    }
    
    // Mock data - in production this would come from database queries
    return {
      totalAttacks: 1245,
      successfulAttacks: 187,
      vulnerabilities: 42,
      meanTimeToDetect: 3.2,
      modelsCovered: 8,
      criticalIssues: 3,
      attackDistribution: [
        { name: 'Prompt Injection', value: 35 },
        { name: 'Jailbreak', value: 25 },
        { name: 'Data Extraction', value: 15 },
        { name: 'Harmful Content', value: 10 },
        { name: 'PII Leakage', value: 8 },
        { name: 'Other', value: 7 }
      ],
      timelineData: [
        { timestamp: '2025-02-25T00:00:00', attemptCount: 42, successCount: 6 },
        { timestamp: '2025-02-25T04:00:00', attemptCount: 25, successCount: 3 },
        { timestamp: '2025-02-25T08:00:00', attemptCount: 63, successCount: 9 },
        { timestamp: '2025-02-25T12:00:00', attemptCount: 87, successCount: 15 },
        { timestamp: '2025-02-25T16:00:00', attemptCount: 105, successCount: 14 },
        { timestamp: '2025-02-25T20:00:00', attemptCount: 76, successCount: 11 },
        { timestamp: '2025-02-26T00:00:00', attemptCount: 54, successCount: 8 },
        { timestamp: '2025-02-26T04:00:00', attemptCount: 32, successCount: 5 },
        { timestamp: '2025-02-26T08:00:00', attemptCount: 68, successCount: 10 },
        { timestamp: '2025-02-26T12:00:00', attemptCount: 92, successCount: 16 },
        { timestamp: '2025-02-26T16:00:00', attemptCount: 110, successCount: 18 },
        { timestamp: '2025-02-26T20:00:00', attemptCount: 82, successCount: 14 },
        { timestamp: '2025-02-27T00:00:00', attemptCount: 58, successCount: 9 },
        { timestamp: '2025-02-27T04:00:00', attemptCount: 35, successCount: 5 },
        { timestamp: '2025-02-27T08:00:00', attemptCount: 72, successCount: 11 },
        { timestamp: '2025-02-27T12:00:00', attemptCount: 95, successCount: 17 },
        { timestamp: '2025-02-27T16:00:00', attemptCount: 115, successCount: 19 },
        { timestamp: '2025-02-27T20:00:00', attemptCount: 85, successCount: 13 }
      ],
      vulnerabilityData: [
        { type: 'Prompt Injection', count: 18, severity: 'critical', successRate: 42 },
        { type: 'Jailbreak', count: 13, severity: 'high', successRate: 35 },
        { type: 'Data Extraction', count: 8, severity: 'medium', successRate: 28 },
        { type: 'Harmful Content', count: 11, severity: 'high', successRate: 32 },
        { type: 'PII Leakage', count: 6, severity: 'medium', successRate: 22 },
        { type: 'Instruction Ignore', count: 5, severity: 'low', successRate: 18 },
        { type: 'Context Manipulation', count: 3, severity: 'medium', successRate: 15 }
      ]
    };
  } catch (error) {
    logger.error(`Error in getDashboardMetrics service: ${error.message}`);
    throw error;
  }
};

/**
 * Get vulnerability metrics
 * @param {Object} timeRange - Time range for the metrics
 * @param {Array<String>} modelIds - Array of model IDs to filter by (optional)
 * @param {Array<String>} vulnerabilityTypes - Array of vulnerability types to filter by (optional)
 * @returns {Object} Vulnerability metrics data
 */
exports.getVulnerabilityMetrics = async (timeRange, modelIds, vulnerabilityTypes) => {
  try {
    // In a real implementation, this would:
    // 1. Query the logs/metrics collections
    // 2. Filter by time range, model IDs, and vulnerability types
    // 3. Aggregate the results
    // 4. Return the formatted data
    
    // Mock data structure for now
    return {
      totalVulnerabilities: 42,
      criticalVulnerabilities: 8,
      highVulnerabilities: 15,
      mediumVulnerabilities: 12,
      lowVulnerabilities: 7,
      vulnerabilityTrend: [
        { date: '2025-02-20', count: 3 },
        { date: '2025-02-21', count: 5 },
        { date: '2025-02-22', count: 4 },
        { date: '2025-02-23', count: 7 },
        { date: '2025-02-24', count: 6 },
        { date: '2025-02-25', count: 8 },
        { date: '2025-02-26', count: 9 }
      ],
      vulnerabilityBreakdown: [
        { type: 'Prompt Injection', count: 18, severity: 'critical', successRate: 42 },
        { type: 'Jailbreak', count: 13, severity: 'high', successRate: 35 },
        { type: 'Data Extraction', count: 8, severity: 'medium', successRate: 28 },
        { type: 'Harmful Content', count: 11, severity: 'high', successRate: 32 },
        { type: 'PII Leakage', count: 6, severity: 'medium', successRate: 22 },
        { type: 'Instruction Ignore', count: 5, severity: 'low', successRate: 18 },
        { type: 'Context Manipulation', count: 3, severity: 'medium', successRate: 15 }
      ],
      topAffectedModels: [
        { modelId: 'model-a', name: 'Model A', vulnerabilityCount: 15 },
        { modelId: 'model-b', name: 'Model B', vulnerabilityCount: 12 },
        { modelId: 'model-c', name: 'Model C', vulnerabilityCount: 8 },
        { modelId: 'model-d', name: 'Model D', vulnerabilityCount: 7 }
      ]
    };
  } catch (error) {
    logger.error(`Error in getVulnerabilityMetrics service: ${error.message}`);
    throw error;
  }
};

/**
 * Get model comparison metrics
 * @param {Array<String>} modelIds - Array of model IDs to compare
 * @param {Object} timeRange - Time range for the metrics (optional)
 * @param {Array<String>} metricTypes - Types of metrics to include (optional)
 * @returns {Object} Model comparison metrics data
 */
exports.getModelComparisonMetrics = async (modelIds, timeRange, metricTypes) => {
  try {
    // In a real implementation, this would:
    // 1. Validate that all modelIds exist
    // 2. Query metrics for each model filtered by time range
    // 3. Format the data for comparison
    
    // Mock comparison data
    return {
      models: [
        { id: 'model-a', name: 'Model A', version: '1.0' },
        { id: 'model-b', name: 'Model B', version: '2.3' },
        { id: 'model-c', name: 'Model C', version: '1.5' }
      ],
      metrics: {
        attackResistance: [
          { modelId: 'model-a', score: 68 },
          { modelId: 'model-b', score: 75 },
          { modelId: 'model-c', score: 62 }
        ],
        promptInjection: [
          { modelId: 'model-a', score: 72 },
          { modelId: 'model-b', score: 81 },
          { modelId: 'model-c', score: 65 }
        ],
        jailbreakResistance: [
          { modelId: 'model-a', score: 65 },
          { modelId: 'model-b', score: 73 },
          { modelId: 'model-c', score: 59 }
        ],
        dataProtection: [
          { modelId: 'model-a', score: 78 },
          { modelId: 'model-b', score: 82 },
          { modelId: 'model-c', score: 71 }
        ],
        harmfulContentFiltering: [
          { modelId: 'model-a', score: 81 },
          { modelId: 'model-b', score: 84 },
          { modelId: 'model-c', score: 76 }
        ]
      },
      vulnerabilityCounts: [
        { modelId: 'model-a', critical: 3, high: 5, medium: 4, low: 2 },
        { modelId: 'model-b', critical: 1, high: 3, medium: 5, low: 4 },
        { modelId: 'model-c', critical: 4, high: 6, medium: 3, low: 2 }
      ]
    };
  } catch (error) {
    logger.error(`Error in getModelComparisonMetrics service: ${error.message}`);
    throw error;
  }
};

/**
 * Get log metrics
 * @param {Object} timeRange - Time range for the logs
 * @param {Object} filters - Additional filters
 * @returns {Object} Log metrics data
 */
exports.getLogMetrics = async (timeRange, filters) => {
  try {
    // In a real implementation, this would query the logs collection
    // For now, return mock data
    
    return {
      totalLogs: 567,
      totalSuccessfulAttacks: 87,
      successRate: 15.3,
      attacksByHour: [
        { hour: 0, count: 18 },
        { hour: 4, count: 12 },
        { hour: 8, count: 35 },
        { hour: 12, count: 42 },
        { hour: 16, count: 38 },
        { hour: 20, count: 22 }
      ],
      attacksByType: [
        { type: 'Prompt Injection', count: 165 },
        { type: 'Jailbreak', count: 132 },
        { type: 'Data Extraction', count: 95 },
        { type: 'Harmful Content', count: 87 },
        { type: 'PII Leakage', count: 65 },
        { type: 'Other', count: 23 }
      ],
      topSuccessfulAttacks: [
        {
          id: 'log-123',
          timestamp: '2025-02-25T14:32:18',
          type: 'Prompt Injection',
          modelId: 'model-a',
          prompt: 'Can you provide information about...',
          success: true
        },
        {
          id: 'log-456',
          timestamp: '2025-02-25T16:15:42',
          type: 'Jailbreak',
          modelId: 'model-b',
          prompt: 'I need you to act as...',
          success: true
        },
        {
          id: 'log-789',
          timestamp: '2025-02-26T09:27:33',
          type: 'Data Extraction',
          modelId: 'model-a',
          prompt: 'Please remember the following...',
          success: true
        }
      ]
    };
  } catch (error) {
    logger.error(`Error in getLogMetrics service: ${error.message}`);
    throw error;
  }
};

/**
 * Get real-time metrics
 * @param {Array<String>} modelIds - Array of model IDs to filter by (optional)
 * @returns {Object} Real-time metrics data
 */
exports.getRealTimeMetrics = async (modelIds) => {
  try {
    // In a real implementation, this would query recent logs/metrics
    // For demo purposes, return mock data
    
    return {
      activeAttacks: 8,
      lastAttackTimestamp: new Date().toISOString(),
      recentAttackTypes: [
        { type: 'Prompt Injection', count: 5 },
        { type: 'Jailbreak', count: 3 },
        { type: 'Data Extraction', count: 2 }
      ],
      attacksPerMinute: 2.7,
      recentSuccessRate: 14.2,
      activeSessions: 12,
      systemLoad: 68
    };
  } catch (error) {
    logger.error(`Error in getRealTimeMetrics service: ${error.message}`);
    throw error;
  }
};
