const mongoose = require('mongoose');

const SignSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  letter: {
    type: String,
    trim: true,
    index: true
  },
  category: {
    type: String,
    enum: ['Alphabet', 'Numbers', 'Greetings', 'Family', 'Colors', 'Food', 'Animals', 'Actions', 'Emotions', 'Time', 'Places', 'Common Phrases', 'Special'],
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
    index: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  video_url: {
    type: String
  },
  gif_url: {
    type: String
  },
  hand_shape: {
    type: String,
    enum: ['Fist', 'Flat', 'Point', 'Open', 'Curved', 'Pinch', 'L-Shape', 'C-Shape', 'O-Shape', 'Other']
  },
  movement: {
    type: String,
    enum: ['Static', 'Up-Down', 'Left-Right', 'Circular', 'Forward-Back', 'Twist', 'Tap', 'Shake', 'Complex']
  },
  location: {
    type: String,
    enum: ['Neutral Space', 'Face', 'Head', 'Chest', 'Waist', 'Side', 'Above Head', 'Below Waist']
  },
  two_handed: {
    type: Boolean,
    default: false
  },
  dominant_hand: {
    type: String,
    enum: ['Right', 'Left', 'Both', 'Either'],
    default: 'Either'
  },
  tags: [String],
  synonyms: [String],
  related_signs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sign'
  }],
  tips: [String],
  common_mistakes: [String],
  cultural_notes: String,
  usage_examples: [String],
  frequency_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  search_keywords: [String],
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
SignSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  
  // Auto-generate search keywords
  if (this.word) {
    this.search_keywords = [
      this.word.toLowerCase(),
      ...this.synonyms.map(s => s.toLowerCase()),
      ...this.tags.map(t => t.toLowerCase()),
      this.category.toLowerCase()
    ];
  }
  
  next();
});

// Text search index
SignSchema.index({
  word: 'text',
  description: 'text',
  instructions: 'text',
  tags: 'text',
  synonyms: 'text',
  search_keywords: 'text'
});

// Compound indexes
SignSchema.index({ category: 1, difficulty: 1 });
SignSchema.index({ is_published: 1, frequency_score: -1 });
SignSchema.index({ two_handed: 1, difficulty: 1 });

module.exports = mongoose.model('Sign', SignSchema);