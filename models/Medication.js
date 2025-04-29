const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = medicationSchema;