const express = require('express');
const logsController = require('../controllers/logs.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   GET api/logs
// @desc    Get logs with filtering and pagination
// @access  Private
router.get('/', logsController.getLogs);

// @route   GET api/logs/stats
// @desc    Get log statistics
// @access  Private
router.get('/stats', logsController.getLogStats);

// @route   GET api/logs/:id
// @desc    Get a single log by ID
// @access  Private
router.get('/:id', logsController.getLogById);

// @route   GET api/logs/:id/related
// @desc    Get related logs
// @access  Private
router.get('/:id/related', logsController.getRelatedLogs);

// @route   POST api/logs
// @desc    Create a new log
// @access  Private
router.post('/', logsController.createLog);

// @route   POST api/logs/batch
// @desc    Batch import logs
// @access  Private
router.post('/batch', logsController.batchImportLogs);

// @route   PUT api/logs/:id
// @desc    Update a log
// @access  Private
router.put('/:id', logsController.updateLog);

// @route   DELETE api/logs/:id
// @desc    Delete a log
// @access  Private
router.delete('/:id', logsController.deleteLog);

module.exports = router;
