const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  category: {
    type: String,
    enum: ['Alphabet', 'Numbers', 'Greetings', 'Family', 'Colors', 'Food', 'Animals', 'Actions', 'Emotions', 'Time', 'Places', 'Common Phrases'],
    required: true
  },
  duration_minutes: {
    type: Number,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  signs: [{
    letter_or_word: String,
    description: String,
    image_url: String,
    video_url: String,
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    tips: [String],
    common_mistakes: [String]
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  learning_objectives: [String],
  practice_exercises: [{
    type: {
      type: String,
      enum: ['recognition', 'production', 'matching', 'sequence'],
      required: true
    },
    instruction: String,
    data: mongoose.Schema.Types.Mixed
  }],
  is_published: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
LessonSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Indexes for better performance
LessonSchema.index({ level: 1, category: 1 });
LessonSchema.index({ is_published: 1, order: 1 });
LessonSchema.index({ slug: 1 });

module.exports = mongoose.model('Lesson', LessonSchema);