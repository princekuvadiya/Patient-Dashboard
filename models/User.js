const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const weightEntrySchema = require('./WeightEntry');
const medicationSchema = require('./Medication');
const shipmentSchema = require('./Shipment');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  weightHistory: [weightEntrySchema],
  initialWeight: {
    type: Number
  },
  currentWeight: {
    type: Number
  },
  goalWeight: {
    type: Number
  },
  height: {
    type: Number // in cm
  },
  medications: [medicationSchema],
  currentMedication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medications'
  },
  shipments: [shipmentSchema],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.calculateBMI = function() {
  if (this.currentWeight && this.height) {
    const heightInMeters = this.height / 100;
    return (this.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
};

userSchema.methods.calculateProgress = function() {
  if (this.initialWeight && this.currentWeight && this.goalWeight) {
    const totalWeightToLose = this.initialWeight - this.goalWeight;
    const weightLostSoFar = this.initialWeight - this.currentWeight;
    return Math.round((weightLostSoFar / totalWeightToLose) * 100);
  }
  return 0;
};

const User = mongoose.model('User', userSchema);

module.exports = User;