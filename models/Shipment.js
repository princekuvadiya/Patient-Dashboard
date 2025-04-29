const mongoose = require('mongoose');

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

module.exports = shipmentSchema;