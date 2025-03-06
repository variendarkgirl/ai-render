const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  // Log metadata
  type: {
    type: String,
    required: true,
    enum: [
      'Prompt Injection',
      'Jailbreak',
      'Data Extraction',
      'Harmful Content',
      'PII Leakage',
      'Instruction Ignore',
      'Context Manipulation',
      'Other'
    ]
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  source: {
    type: String,
    enum: ['API', 'Web Interface', 'Extension', 'CLI', 'Other'],
    default: 'API'
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  
  // Attack details
  modelId: {
    type: String,
    required: true
  },
  modelName: {
    type: String
  },
  prompt: {
    type: String,
    required: true
  },
  response: {
    type: String
  },
  success: {
    type: Boolean,
    default: false
  },
  blocked: {
    type: Boolean,
    default: false
  },
  
  // Additional metadata
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String
  },
  requestId: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  
  // Attack vectors and techniques
  attackVectors: [{
    type: String
  }],
  attackTechniques: [{
    type: String
  }],
  
  // Analysis and tags
  tags: [{
    type: String
  }],
  notes: {
    type: String
  },
  
  // Related attacks (for attack campaigns)
  relatedLogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Log'
  }]
}, {
  timestamps: true
});

// Create indices for common queries
logSchema.index({ timestamp: -1 });
logSchema.index({ modelId: 1 });
logSchema.index({ type: 1 });
logSchema.index({ success: 1 });
logSchema.index({ severity: 1 });

// Create Log model
const Log = mongoose.model('Log', logSchema);

module.exports = Log;
