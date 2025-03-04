const Model = require('../models/model.model');
const Log = require('../models/log.model');
const logger = require('../../utils/logger');

/**
 * Get all models with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getModels = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    
    // Build query
    const query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { modelId: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get models
    const models = await Model.find(query).sort({ name: 1 });
    
    res.status(200).json(models);
  } catch (error) {
    logger.error(`Error getting models: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving models' });
  }
};

/**
 * Get a single model by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getModelById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const model = await Model.findOne({ 
      $or: [
        { _id: id },
        { modelId: id }
      ]
    });
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.status(200).json(model);
  } catch (error) {
    logger.error(`Error getting model by ID: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving model' });
  }
};

/**
 * Create a new model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createModel = async (req, res) => {
  try {
    const modelData = req.body;
    
    // Check if model already exists
    const existingModel = await Model.findOne({ modelId: modelData.modelId });
    if (existingModel) {
      return res.status(400).json({ message: 'Model ID already exists' });
    }
    
    // Create model
    const newModel = new Model(modelData);
    await newModel.save();
    
    res.status(201).json({
      message: 'Model created successfully',
      model: newModel
    });
  } catch (error) {
    logger.error(`Error creating model: ${error.message}`);
    res.status(500).json({ message: 'Server error creating model' });
  }
};

/**
 * Update a model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find model to update
    const model = await Model.findOne({
      $or: [
        { _id: id },
        { modelId: id }
      ]
    });
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    // Check if updating modelId and if it already exists
    if (updateData.modelId && updateData.modelId !== model.modelId) {
      const existingModel = await Model.findOne({ modelId: updateData.modelId });
      if (existingModel) {
        return res.status(400).json({ message: 'Model ID already exists' });
      }
    }
    
    // Update model
    Object.keys(updateData).forEach(key => {
      model[key] = updateData[key];
    });
    
    await model.save();
    
    res.status(200).json({
      message: 'Model updated successfully',
      model
    });
  } catch (error) {
    logger.error(`Error updating model: ${error.message}`);
    res.status(500).json({ message: 'Server error updating model' });
  }
};

/**
 * Delete a model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteModel = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find model to delete
    const model = await Model.findOne({
      $or: [
        { _id: id },
        { modelId: id }
      ]
    });
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    // Check if model is referenced in logs
    const logCount = await Log.countDocuments({ modelId: model.modelId });
    if (logCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete model that is referenced in logs',
        logCount
      });
    }
    
    // Delete model
    await model.deleteOne();
    
    res.status(200).json({
      message: 'Model deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting model: ${error.message}`);
    res.status(500).json({ message: 'Server error deleting model' });
  }
};

/**
 * Get model vulnerabilities
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getModelVulnerabilities = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    // Find model
    const model = await Model.findOne({
      $or: [
        { _id: id },
        { modelId: id }
      ]
    });
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    // Build query for logs
    const query = { modelId: model.modelId };
    
    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Get vulnerability stats from logs
    const vulnerabilities = await Log.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
          },
          blockedCount: {
            $sum: { $cond: [{ $eq: ['$blocked', true] }, 1, 0] }
          },
          severities: { $push: '$severity' }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
          successCount: 1,
          blockedCount: 1,
          successRate: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              { $multiply: [{ $divide: ['$successCount', '$count'] }, 100] }
            ]
          },
          severity: {
            $cond: {
              if: { $gt: ['$successCount', 0] },
              then: 'critical',
              else: {
                $cond: {
                  if: { $gt: [{ $size: '$severities' }, 0] },
                  then: { $arrayElemAt: ['$severities', 0] },
                  else: 'medium'
                }
              }
            }
          }
        }
      },
      { $sort: { successRate: -1 } }
    ]);
    
    // Get overall stats
    const stats = await Log.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          successful: { $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] } },
          blocked: { $sum: { $cond: [{ $eq: ['$blocked', true] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          successful: 1,
          blocked: 1,
          successRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$successful', '$total'] }, 100] }
            ]
          }
        }
      }
    ]);
    
    res.status(200).json({
      model: {
        id: model._id,
        modelId: model.modelId,
        name: model.name,
        version: model.version
      },
      vulnerabilities,
      stats: stats.length > 0 ? stats[0] : {
        total: 0,
        successful: 0,
        blocked: 0,
        successRate: 0
      }
    });
  } catch (error) {
    logger.error(`Error getting model vulnerabilities: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving model vulnerabilities' });
  }
};

/**
 * Get model performance metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getModelPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, interval = 'day' } = req.query;
    
    // Find model
    const model = await Model.findOne({
      $or: [
        { _id: id },
        { modelId: id }
      ]
    });
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    // Build query for logs
    const query = { modelId: model.modelId };
    
    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Determine date grouping based on interval
    let dateFormat;
    switch (interval) {
      case 'hour':
        dateFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          hour: { $hour: '$timestamp' }
        };
        break;
      case 'week':
        dateFormat = {
          year: { $year: '$timestamp' },
          week: { $week: '$timestamp' }
        };
        break;
      case 'month':
        dateFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' }
        };
        break;
      case 'day':
      default:
        dateFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        };
    }
    
    // Get performance metrics over time
    const performanceOverTime = await Log.aggregate([
      { $match: query },
      {
        $group: {
          _id: dateFormat,
          total: { $sum: 1 },
          successful: { $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] } },
          blocked: { $sum: { $cond: [{ $eq: ['$blocked', true] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total: 1,
          successful: 1,
          blocked: 1,
          successRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$successful', '$total'] }, 100] }
            ]
          }
        }
      },
      { $sort: { 'date.year': 1, 'date.month': 1, 'date.day': 1, 'date.hour': 1 } }
    ]);
    
    // Format dates based on interval
    const formattedPerformance = performanceOverTime.map(item => {
      let dateStr;
      
      switch (interval) {
        case 'hour':
          dateStr = new Date(
            item.date.year, 
            item.date.month - 1, 
            item.date.day, 
            item.date.hour
          ).toISOString();
          break;
        case 'week':
          // Create date from year and week number (approximate)
          const janFirst = new Date(item.date.year, 0, 1);
          dateStr = new Date(
            janFirst.getTime() + (item.date.week * 7 * 24 * 60 * 60 * 1000)
          ).toISOString();
          break;
        case 'month':
          dateStr = new Date(
            item.date.year, 
            item.date.month - 1, 
            1
          ).toISOString();
          break;
        case 'day':
        default:
          dateStr = new Date(
            item.date.year, 
            item.date.month - 1, 
            item.date.day
          ).toISOString();
      }
      
      return {
        date: dateStr,
        total: item.total,
        successful: item.successful,
        blocked: item.blocked,
        successRate: item.successRate
      };
    });
    
    res.status(200).json({
      model: {
        id: model._id,
        modelId: model.modelId,
        name: model.name,
        version: model.version
      },
      performance: formattedPerformance,
      interval
    });
  } catch (error) {
    logger.error(`Error getting model performance: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving model performance' });
  }
};

/**
 * Update model security metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateModelSecurityMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      attackResistance,
      promptInjection,
      jailbreakResistance,
      dataProtection,
      harmfulContentFiltering
    } = req.body;
    
    // Find model to update
    const model = await Model.findOne({
      $or: [
        { _id: id },
        { modelId: id }
      ]
    });
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    // Update security metrics
    model.performanceMetrics = {
      ...model.performanceMetrics,
      ...(attackResistance !== undefined && { attackResistance }),
      ...(promptInjection !== undefined && { promptInjection }),
      ...(jailbreakResistance !== undefined && { jailbreakResistance }),
      ...(dataProtection !== undefined && { dataProtection }),
      ...(harmfulContentFiltering !== undefined && { harmfulContentFiltering })
    };
    
    // Update last tested date
    model.lastTestedDate = new Date();
    
    await model.save();
    
    res.status(200).json({
      message: 'Security metrics updated successfully',
      model
    });
  } catch (error) {
    logger.error(`Error updating model security metrics: ${error.message}`);
    res.status(500).json({ message: 'Server error updating security metrics' });
  }
};
