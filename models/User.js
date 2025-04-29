const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Sub-schema for weight entries
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

// Sub-schema for medication details
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

// Sub-schema for shipment tracking
const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String
  },
  carrier: {
    type: String
  },
  estimatedDeliveryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'delayed'],
    default: 'processing'
  },
  shippedDate: {
    type: Date
  },
  deliveredDate: {
    type: Date
  }
});

// Main User schema
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
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create index for email field for faster queries
userSchema.index({ email: 1 });

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords for authentication
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to calculate BMI
userSchema.methods.calculateBMI = function() {
  if (this.currentWeight && this.height) {
    // BMI = weight(kg) / (height(m))²
    const heightInMeters = this.height / 100;
    return (this.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
};

// Method to calculate progress percentage towards goal
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

