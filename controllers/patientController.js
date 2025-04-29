const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.getWeightHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('weightHistory');
    res.json(user.weightHistory || []);
  } catch (err) {
    console.error('Get weight history error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.addWeightEntry = async (req, res, next) => {
  const { weight, date, notes } = req.body;

  try {
    const weightEntry = {
      weight,
      date: date || Date.now(),
      notes
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { weightHistory: weightEntry },
        $set: { currentWeight: weight }
      },
      { new: true }
    );

    res.json(weightEntry);
  } catch (err) {
    console.error('Add weight entry error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.getShipments = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('shipments');
    res.json(user.shipments || []);
  } catch (err) {
    console.error('Get shipments error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.addShipment = async (req, res, next) => {
  const { trackingNumber, carrier, estimatedDeliveryDate, status } = req.body;

  try {
    const shipment = {
      trackingNumber,
      carrier,
      estimatedDeliveryDate,
      status: status || 'processing'
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { shipments: shipment } },
      { new: true }
    );

    res.json(shipment);
  } catch (err) {
    console.error('Add shipment error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.seedData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.weightHistory = [
      { date: new Date('2025-03-01'), weight: user.initialWeight || 100, notes: 'Initial weigh-in' },
      { date: new Date('2025-03-15'), weight: 98, notes: 'Progress check' },
      { date: new Date('2025-04-01'), weight: 95, notes: 'Monthly check' }
    ];

    user.shipments = [
      {
        trackingNumber: 'TRK123456',
        carrier: 'UPS',
        estimatedDeliveryDate: new Date('2025-04-10'),
        status: 'processing',
        shippedDate: null
      },
      {
        trackingNumber: 'TRK789012',
        carrier: 'FedEx',
        estimatedDeliveryDate: new Date('2025-03-20'),
        status: 'delivered',
        shippedDate: new Date('2025-03-15'),
        deliveredDate: new Date('2025-03-20')
      }
    ];

    user.medications = [
      {
        name: 'Semaglutide',
        dosage: '0.5mg',
        frequency: 'Weekly',
        startDate: new Date('2025-03-01')
      }
    ];
    user.currentMedication = user.medications[0]._id;

    await user.save();
    res.json({ message: 'Mock data seeded successfully' });
  } catch (err) {
    console.error('Seed data error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.getUserProfileByToken = async (req, res, next) => {
  try {
    const user = req.user;
    const userData = user.toObject();
    userData.bmi = user.calculateBMI();
    userData.progressPercentage = user.calculateProgress();
    res.json(userData);
  } catch (err) {
    console.error('Get user profile error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.getUserWeightHistoryByToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('weightHistory');
    res.json(user.weightHistory || []);
  } catch (err) {
    console.error('Get user weight history error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.getUserShipmentsByToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('shipments');
    res.json(user.shipments || []);
  } catch (err) {
    console.error('Get user shipments error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};