const logService = require('../../services/log.service');
const logger = require('../../utils/logger');

/**
 * Get logs with filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLogs = async (req, res) => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      modelId,
      type,
      success,
      blocked,
      severity,
      source,
      searchText
    } = req.query;
    
    // Convert string parameters to proper types
    const filters = {
      startDate,
      endDate,
      modelId,
      type,
      success: success !== undefined ? success === 'true' : undefined,
      blocked: blocked !== undefined ? blocked === 'true' : undefined,
      severity,
      source,
      searchText
    };
    
    // Convert string arrays if necessary
    if (typeof modelId === 'string' && modelId.includes(',')) {
      filters.modelId = modelId.split(',');
    }
    
    if (typeof type === 'string' && type.includes(',')) {
      filters.type = type.split(',');
    }
    
    if (typeof severity === 'string' && severity.includes(',')) {
      filters.severity = severity.split(',');
    }
    
    if (typeof source === 'string' && source.includes(',')) {
      filters.source = source.split(',');
    }
    
    // Set up pagination
    const pagination = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    };
    
    // Get logs
    const result = await logService.getLogs(filters, pagination);
    
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error getting logs: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving logs' });
  }
};

/**
 * Get a single log by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const log = await logService.getLogById(id);
    
    res.status(200).json(log);
  } catch (error) {
    logger.error(`Error getting log by ID: ${error.message}`);
    
    if (error.message === 'Log not found') {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    res.status(500).json({ message: 'Error retrieving log' });
  }
};

/**
 * Create a new log
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createLog = async (req, res) => {
  try {
    const logData = req.body;
    
    // Process and analyze the log data
    const processedLogData = await logService.processLogData(logData);
    
    // Create log
    const newLog = await logService.createLog(processedLogData);
    
    res.status(201).json({
      message: 'Log created successfully',
      log: newLog
    });
  } catch (error) {
    logger.error(`Error creating log: ${error.message}`);
    res.status(500).json({ message: 'Error creating log' });
  }
};

/**
 * Update a log
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedLog = await logService.updateLog(id, updateData);
    
    res.status(200).json({
      message: 'Log updated successfully',
      log: updatedLog
    });
  } catch (error) {
    logger.error(`Error updating log: ${error.message}`);
    
    if (error.message === 'Log not found') {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    res.status(500).json({ message: 'Error updating log' });
  }
};

/**
 * Delete a log
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    
    await logService.deleteLog(id);
    
    res.status(200).json({
      message: 'Log deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting log: ${error.message}`);
    
    if (error.message === 'Log not found') {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    res.status(500).json({ message: 'Error deleting log' });
  }
};

/**
 * Get log statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLogStats = async (req, res) => {
  try {
    // Extract query parameters
    const {
      startDate,
      endDate,
      modelId,
      type,
      severity,
      source
    } = req.query;
    
    // Build filters
    const filters = {
      startDate,
      endDate,
      modelId,
      type,
      severity,
      source
    };
    
    // Convert string arrays if necessary
    if (typeof modelId === 'string' && modelId.includes(',')) {
      filters.modelId = modelId.split(',');
    }
    
    if (typeof type === 'string' && type.includes(',')) {
      filters.type = type.split(',');
    }
    
    if (typeof severity === 'string' && severity.includes(',')) {
      filters.severity = severity.split(',');
    }
    
    if (typeof source === 'string' && source.includes(',')) {
      filters.source = source.split(',');
    }
    
    // Get stats
    const stats = await logService.getLogStats(filters);
    
    res.status(200).json(stats);
  } catch (error) {
    logger.error(`Error getting log stats: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving log statistics' });
  }
};

/**
 * Get related logs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRelatedLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;
    
    const relatedLogs = await logService.getRelatedLogs(id, parseInt(limit, 10));
    
    res.status(200).json(relatedLogs);
  } catch (error) {
    logger.error(`Error getting related logs: ${error.message}`);
    
    if (error.message === 'Log not found') {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    res.status(500).json({ message: 'Error retrieving related logs' });
  }
};

/**
 * Batch import logs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.batchImportLogs = async (req, res) => {
  try {
    const logs = req.body;
    
    if (!Array.isArray(logs)) {
      return res.status(400).json({ message: 'Request body must be an array of logs' });
    }
    
    const results = {
      total: logs.length,
      successful: 0,
      failed: 0,
      errors: []
    };
    
    // Process logs sequentially
    for (const logData of logs) {
      try {
        // Process and create log
        const processedLogData = await logService.processLogData(logData);
        await logService.createLog(processedLogData);
        
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          log: logData,
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      message: 'Batch import completed',
      results
    });
  } catch (error) {
    logger.error(`Error in batch import: ${error.message}`);
    res.status(500).json({ message: 'Error processing batch import' });
  }
};
