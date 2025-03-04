const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  // Metric identification
  metricName: {
    type: String,
    required: true
  },
  metricType: {
    type: String,
    enum: ['vulnerability', 'performance', 'attack', 'system'],
    required: true
  },
  
  // Time period
  timeRange: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  
  // Model association (if applicable)
  modelId: {
    type: String
  },
  
  // Metric data
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Data aggregation info
  aggregationType: {
    type: String,
    enum: ['sum', 'average', 'count', 'min', 'max'],
    default: 'sum'
  },
  
  // Additional properties
  tags: [{
    type: String
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for efficient querying
metricSchema.index({ metricName: 1, modelId: 1, 'timeRange.start': 1, 'timeRange.end': 1 });

// Create Metric model
const Metric = mongoose.model('Metric', metricSchema);

module.exports = Metric;
