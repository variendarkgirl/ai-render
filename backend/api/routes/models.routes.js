const express = require('express');
const modelsController = require('../controllers/models.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   GET api/models
// @desc    Get all models with optional filtering
// @access  Private
router.get('/', modelsController.getModels);

// @route   GET api/models/:id
// @desc    Get a single model by ID
// @access  Private
router.get('/:id', modelsController.getModelById);

// @route   GET api/models/:id/vulnerabilities
// @desc    Get model vulnerabilities
// @access  Private
router.get('/:id/vulnerabilities', modelsController.getModelVulnerabilities);

// @route   GET api/models/:id/performance
// @desc    Get model performance metrics
// @access  Private
router.get('/:id/performance', modelsController.getModelPerformance);

// @route   POST api/models
// @desc    Create a new model
// @access  Private
router.post('/', modelsController.createModel);

// @route   PUT api/models/:id
// @desc    Update a model
// @access  Private
router.put('/:id', modelsController.updateModel);

// @route   PUT api/models/:id/security-metrics
// @desc    Update model security metrics
// @access  Private
router.put('/:id/security-metrics', modelsController.updateModelSecurityMetrics);

// @route   DELETE api/models/:id
// @desc    Delete a model
// @access  Private
router.delete('/:id', modelsController.deleteModel);

module.exports = router;
