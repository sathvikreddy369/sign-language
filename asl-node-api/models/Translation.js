const mongoose = require('mongoose');

const TranslationSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  text: { 
    type: String, 
    required: true,
    trim: true
  },
  word_count: { 
    type: Number,
    default: 0
  },
  character_count: { 
    type: Number,
    default: 0
  },
  created_at: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  },
  // Optional metadata
  confidence_scores: [{
    letter: String,
    confidence: Number
  }],
  session_id: {
    type: String,
    index: true
  }
});

// Update the updated_at field before saving
TranslationSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  
  // Calculate word and character counts
  if (this.text) {
    this.character_count = this.text.length;
    this.word_count = this.text.trim() ? this.text.trim().split(/\s+/).length : 0;
  }
  
  next();
});

// Add indexes for better query performance
TranslationSchema.index({ user_id: 1, created_at: -1 });
TranslationSchema.index({ created_at: -1 });
TranslationSchema.index({ word_count: 1 });

module.exports = mongoose.model('Translation', TranslationSchema);