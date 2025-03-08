const express = require('express');
const metricsController = require('../controllers/metrics.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET api/metrics/dashboard
// @desc    Get dashboard metrics
// @access  Private
router.get('/dashboard', authMiddleware, metricsController.getDashboardMetrics);

// @route   GET api/metrics/vulnerabilities
// @desc    Get vulnerability metrics
// @access  Private
router.get('/vulnerabilities', authMiddleware, metricsController.getVulnerabilityMetrics);

// @route   GET api/metrics/models/compare
// @desc    Get model comparison metrics
// @access  Private
router.get('/models/compare', authMiddleware, metricsController.getModelComparisonMetrics);

// @route   GET api/metrics/logs
// @desc    Get log metrics
// @access  Private
router.get('/logs', authMiddleware, metricsController.getLogMetrics);

// @route   GET api/metrics/realtime
// @desc    Get real-time metrics
// @access  Private
router.get('/realtime', authMiddleware, metricsController.getRealTimeMetrics);

// @route   POST api/metrics/export
// @desc    Export metrics data
// @access  Private
router.post('/export', authMiddleware, metricsController.exportMetricsData);

module.exports = router;
