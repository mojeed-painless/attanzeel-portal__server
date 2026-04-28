const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true, // e.g., 'Kindergarten', 'Primary', 'Secondary'
  },
  subjects: [{
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Class', classSchema);