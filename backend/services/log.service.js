const Log = require('../api/models/log.model');
const Model = require('../api/models/model.model');
const logger = require('../utils/logger');

/**
 * Create a new attack log
 * @param {Object} logData - Log data to be saved
 * @returns {Object} Created log
 */
exports.createLog = async (logData) => {
  try {
    // If model name is not provided but modelId is, try to fetch model name
    if (logData.modelId && !logData.modelName) {
      try {
        const model = await Model.findOne({ modelId: logData.modelId });
        if (model) {
          logData.modelName = model.name;
        }
      } catch (error) {
        logger.warn(`Error fetching model name for ${logData.modelId}: ${error.message}`);
        // Continue without model name if not found
      }
    }
    
    // Create and save log
    const newLog = new Log(logData);
    await newLog.save();
    
    return newLog;
  } catch (error) {
    logger.error(`Error creating log: ${error.message}`);
    throw error;
  }
};

/**
 * Get logs with optional filtering
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @returns {Object} Logs and pagination info
 */
exports.getLogs = async (filters = {}, pagination = { page: 1, limit: 20 }) => {
  try {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = buildLogQuery(filters);
    
    // Execute query with pagination
    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Log.countDocuments(query);
    
    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error fetching logs: ${error.message}`);
    throw error;
  }
};

/**
 * Get a single log by ID
 * @param {String} logId - Log ID
 * @returns {Object} Log document
 */
exports.getLogById = async (logId) => {
  try {
    const log = await Log.findById(logId);
    
    if (!log) {
      throw new Error('Log not found');
    }
    
    return log;
  } catch (error) {
    logger.error(`Error fetching log by ID: ${error.message}`);
    throw error;
  }
};

/**
 * Update a log
 * @param {String} logId - Log ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated log
 */
exports.updateLog = async (logId, updateData) => {
  try {
    const log = await Log.findByIdAndUpdate(
      logId,
      { $set: updateData },
      { new: true }
    );
    
    if (!log) {
      throw new Error('Log not found');
    }
    
    return log;
  } catch (error) {
    logger.error(`Error updating log: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a log
 * @param {String} logId - Log ID
 * @returns {Boolean} Success indicator
 */
exports.deleteLog = async (logId) => {
  try {
    const result = await Log.findByIdAndDelete(logId);
    
    if (!result) {
      throw new Error('Log not found');
    }
    
    return true;
  } catch (error) {
    logger.error(`Error deleting log: ${error.message}`);
    throw error;
  }
};

/**
 * Get logs statistics
 * @param {Object} filters - Filter criteria
 * @returns {Object} Statistics about logs
 */
exports.getLogStats = async (filters = {}) => {
  try {
    const query = buildLogQuery(filters);
    
    // Run aggregation pipeline
    const stats = await Log.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalLogs: { $sum: 1 },
          successfulAttacks: {
            $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
          },
          blockedAttacks: {
            $sum: { $cond: [{ $eq: ['$blocked', true] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalLogs: 1,
          successfulAttacks: 1,
          blockedAttacks: 1,
          successRate: {
            $multiply: [
              { $divide: ['$successfulAttacks', { $max: ['$totalLogs', 1] }] },
              100
            ]
          }
        }
      }
    ]);
    
    // Get attack type distribution
    const attackTypes = await Log.aggregate([
      { $match: query },
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
          type: '$_id',
          count: 1
        }
      }
    ]);
    
    // Get hourly distribution
    const hourlyDistribution = await Log.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          _id: 0,
          hour: '$_id',
          count: 1
        }
      }
    ]);
    
    // Add default result if no logs found
    const result = stats.length > 0 ? stats[0] : {
      totalLogs: 0,
      successfulAttacks: 0,
      blockedAttacks: 0,
      successRate: 0
    };
    
    return {
      ...result,
      attacksByType: attackTypes,
      attacksByHour: hourlyDistribution
    };
  } catch (error) {
    logger.error(`Error getting log stats: ${error.message}`);
    throw error;
  }
};

/**
 * Build MongoDB query from filters
 * @param {Object} filters - Filter criteria
 * @returns {Object} MongoDB query object
 */
const buildLogQuery = (filters) => {
  const query = {};
  
  // Filter by date range
  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    
    if (filters.startDate) {
      query.timestamp.$gte = new Date(filters.startDate);
    }
    
    if (filters.endDate) {
      query.timestamp.$lte = new Date(filters.endDate);
    }
  }
  
  // Filter by model ID
  if (filters.modelId) {
    if (Array.isArray(filters.modelId)) {
      query.modelId = { $in: filters.modelId };
    } else {
      query.modelId = filters.modelId;
    }
  }
  
  // Filter by attack type
  if (filters.type) {
    if (Array.isArray(filters.type)) {
      query.type = { $in: filters.type };
    } else {
      query.type = filters.type;
    }
  }
  
  // Filter by success/failure
  if (filters.success !== undefined) {
    query.success = filters.success;
  }
  
  // Filter by blocked status
  if (filters.blocked !== undefined) {
    query.blocked = filters.blocked;
  }
  
  // Filter by severity
  if (filters.severity) {
    if (Array.isArray(filters.severity)) {
      query.severity = { $in: filters.severity };
    } else {
      query.severity = filters.severity;
    }
  }
  
  // Filter by source
  if (filters.source) {
    if (Array.isArray(filters.source)) {
      query.source = { $in: filters.source };
    } else {
      query.source = filters.source;
    }
  }
  
  // Text search in prompt and response
  if (filters.searchText) {
    query.$or = [
      { prompt: { $regex: filters.searchText, $options: 'i' } },
      { response: { $regex: filters.searchText, $options: 'i' } }
    ];
  }
  
  return query;
};

/**
 * Get related logs based on similarity
 * @param {String} logId - Source log ID
 * @param {Number} limit - Maximum number of related logs to return
 * @returns {Array} Array of related logs
 */
exports.getRelatedLogs = async (logId, limit = 5) => {
  try {
    const sourceLog = await Log.findById(logId);
    
    if (!sourceLog) {
      throw new Error('Log not found');
    }
    
    // Find logs with the same attack type and model
    const relatedLogs = await Log.find({
      _id: { $ne: logId },
      $or: [
        { type: sourceLog.type },
        { modelId: sourceLog.modelId }
      ]
    })
      .sort({ timestamp: -1 })
      .limit(limit);
    
    return relatedLogs;
  } catch (error) {
    logger.error(`Error getting related logs: ${error.message}`);
    throw error;
  }
};

/**
 * Process and analyze incoming log data
 * @param {Object} logData - Raw log data
 * @returns {Object} Processed log data with analysis
 */
exports.processLogData = async (logData) => {
  try {
    // Here you would implement log analysis logic
    // For example:
    // - Determine severity based on attack type and success
    // - Extract attack vectors and techniques
    // - Add relevant tags
    
    const processedLog = { ...logData };
    
    // Example: Set severity based on attack type and success
    if (!processedLog.severity) {
      if (processedLog.success) {
        processedLog.severity = 'critical';
      } else if (processedLog.type === 'Prompt Injection' || 
                processedLog.type === 'Jailbreak' ||
                processedLog.type === 'PII Leakage') {
        processedLog.severity = 'high';
      } else {
        processedLog.severity = 'medium';
      }
    }
    
    // Example: Add tags based on prompt content
    processedLog.tags = processedLog.tags || [];
    
    if (processedLog.prompt.toLowerCase().includes('system prompt')) {
      processedLog.tags.push('system-prompt-attack');
    }
    
    if (processedLog.prompt.toLowerCase().includes('ignore')) {
      processedLog.tags.push('instruction-override');
    }
    
    return processedLog;
  } catch (error) {
    logger.error(`Error processing log data: ${error.message}`);
    // Return original data if processing fails
    return logData;
  }
};
