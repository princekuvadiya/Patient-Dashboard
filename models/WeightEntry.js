const mongoose = require('mongoose');

const weightEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  weight: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  }
});

module.exports = weightEntrySchema;