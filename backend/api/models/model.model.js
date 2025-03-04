const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  // Model identity
  modelId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  provider: {
    type: String
  },
  
  // Model type and capabilities
  type: {
    type: String,
    enum: ['Text Generation', 'Image Generation', 'Multimodal', 'Code Generation', 'Other'],
    default: 'Text Generation'
  },
  capabilities: [{
    type: String
  }],
  
  // Status and deployment
  status: {
    type: String,
    enum: ['active', 'testing', 'archived', 'maintenance'],
    default: 'active'
  },
  deploymentEnvironment: {
    type: String,
    enum: ['production', 'staging', 'development'],
    default: 'development'
  },
  
  // Security and red-teaming
  securityLevel: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  vulnerabilities: [{
    type: String
  }],
  lastTestedDate: {
    type: Date
  },
  
  // Performance and metrics
  performanceMetrics: {
    attackResistance: {
      type: Number,
      min: 0,
      max: 100
    },
    promptInjection: {
      type: Number,
      min: 0,
      max: 100
    },
    jailbreakResistance: {
      type: Number,
      min: 0,
      max: 100
    },
    dataProtection: {
      type: Number,
      min: 0,
      max: 100
    },
    harmfulContentFiltering: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // API and integration details
  apiEndpoint: {
    type: String
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Teams and ownership
  responsibleTeam: {
    type: String
  },
  maintainers: [{
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

// Create Model model
const Model = mongoose.model('Model', modelSchema);

module.exports = Model;
