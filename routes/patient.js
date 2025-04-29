const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const User = require('../models/User');

/**
 * @route   GET api/patient/weight
 * @desc    Get user's weight history
 * @access  Private
 */
router.get('/weight', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('weightHistory');
    res.json(user.weightHistory || []);
  } catch (err) {
    console.error('Get weight history error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST api/patient/weight
 * @desc    Add weight entry
 * @access  Private
 */
router.post(
  '/weight',
  [
    auth,
    [
      check('weight', 'Weight is required').isNumeric(),
      check('date', 'Valid date is required').optional().isISO8601()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { weight, date, notes } = req.body;

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
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   GET api/patient/shipments
 * @desc    Get user's shipments
 * @access  Private
 */
router.get('/shipments', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('shipments');
    res.json(user.shipments || []);
  } catch (err) {
    console.error('Get shipments error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/patient/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  [
    auth,
    [
      check('firstName', 'First name is required').optional().not().isEmpty(),
      check('lastName', 'Last name is required').optional().not().isEmpty(),
      check('email', 'Please include a valid email').optional().isEmail(),
      check('currentWeight', 'Current weight must be a number').optional().isNumeric(),
      check('goalWeight', 'Goal weight must be a number').optional().isNumeric(),
      check('height', 'Height must be a number').optional().isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updates = req.body;

      if (updates.currentWeight) {
        updates.weightHistory = [...req.user.weightHistory, {
          date: Date.now(),
          weight: updates.currentWeight
        }];
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      res.json(user);
    } catch (err) {
      console.error('Update profile error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
/**
 * @route   POST api/patient/shipments
 * @desc    Add a shipment (mock for prototype)
 * @access  Private
 */
router.post(
    '/shipments',
    [
      auth,
      [
        check('trackingNumber', 'Tracking number is required').not().isEmpty(),
        check('carrier', 'Carrier is required').not().isEmpty(),
        check('estimatedDeliveryDate', 'Valid date is required').isISO8601()
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const { trackingNumber, carrier, estimatedDeliveryDate, status } = req.body;
  
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
        res.status(500).json({ message: 'Server error' });
      }
    }
  );


  /**
 * @route   POST api/patient/seed
 * @desc    Seed mock data for testing (prototype only)
 * @access  Private
 */
router.post('/seed', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      // Mock weight history
      user.weightHistory = [
        { date: new Date('2025-03-01'), weight: user.initialWeight || 100, notes: 'Initial weigh-in' },
        { date: new Date('2025-03-15'), weight: 98, notes: 'Progress check' },
        { date: new Date('2025-04-01'), weight: 95, notes: 'Monthly check' }
      ];
  
      // Mock shipments
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
  
      // Mock medication
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
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;