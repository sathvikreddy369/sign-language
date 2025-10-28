const mongoose = require('mongoose');

const PredictionLogSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  label: { 
    type: String,
    index: true
  },
  confidence: { 
    type: Number,
    min: 0,
    max: 1
  },
  latency_ms: { 
    type: Number,
    min: 0
  },
  success: { 
    type: Boolean, 
    default: true,
    index: true
  },
  error_message: { 
    type: String 
  },
  client_ip: { 
    type: String 
  },
  top_predictions: { 
    type: mongoose.Schema.Types.Mixed 
  }
});

// Add indexes for better query performance
PredictionLogSchema.index({ user_id: 1, timestamp: -1 });
PredictionLogSchema.index({ label: 1, success: 1 });
PredictionLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('PredictionLog', PredictionLogSchema);