const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'mastered'],
    default: 'not_started',
    index: true
  },
  progress_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed_signs: [{
    sign_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sign'
    },
    attempts: {
      type: Number,
      default: 0
    },
    correct_attempts: {
      type: Number,
      default: 0
    },
    last_practiced: {
      type: Date,
      default: Date.now
    },
    mastery_level: {
      type: String,
      enum: ['learning', 'practicing', 'proficient', 'mastered'],
      default: 'learning'
    }
  }],
  quiz_scores: [{
    quiz_type: String,
    score: Number,
    max_score: Number,
    completed_at: {
      type: Date,
      default: Date.now
    }
  }],
  time_spent_minutes: {
    type: Number,
    default: 0
  },
  started_at: {
    type: Date,
    default: Date.now
  },
  completed_at: {
    type: Date
  },
  last_accessed: {
    type: Date,
    default: Date.now
  },
  notes: String,
  bookmarked: {
    type: Boolean,
    default: false
  }
});

// Compound indexes
UserProgressSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });
UserProgressSchema.index({ user_id: 1, status: 1 });
UserProgressSchema.index({ user_id: 1, last_accessed: -1 });

// Update last_accessed on save
UserProgressSchema.pre('save', function(next) {
  this.last_accessed = Date.now();
  
  // Auto-calculate progress percentage
  if (this.completed_signs && this.completed_signs.length > 0) {
    const masteredSigns = this.completed_signs.filter(s => s.mastery_level === 'mastered').length;
    const totalSigns = this.completed_signs.length;
    this.progress_percentage = Math.round((masteredSigns / totalSigns) * 100);
    
    // Update status based on progress
    if (this.progress_percentage === 100) {
      this.status = 'mastered';
      this.completed_at = this.completed_at || new Date();
    } else if (this.progress_percentage >= 80) {
      this.status = 'completed';
      this.completed_at = this.completed_at || new Date();
    } else if (this.progress_percentage > 0) {
      this.status = 'in_progress';
    }
  }
  
  next();
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);