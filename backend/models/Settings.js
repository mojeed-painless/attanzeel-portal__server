const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    currentTerm: {
      type: String,
      enum: ['First Term', 'Second Term', 'Third Term'],
      default: 'First Term',
    },
    currentSession: {
      type: String,
      default: '2025/2026',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
