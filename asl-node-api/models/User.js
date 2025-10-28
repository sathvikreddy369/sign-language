const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    lowercase: true,
    trim: true
  },
  password_hash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: 'user',
    enum: ['user', 'admin']
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  blocked: { 
    type: Boolean, 
    default: false 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  },
  last_activity_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updated_at field before saving
UserSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Add indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ active: 1, blocked: 1 });

module.exports = mongoose.model('User', UserSchema);
