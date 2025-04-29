const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const User = require('../models/User');

/**
 * @route   POST api/auth/register
 * @desc    Register a user
 * @access  Public
 */
router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, initialWeight, goalWeight, height } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        password,
        initialWeight,
        currentWeight: initialWeight,
        goalWeight,
        height
      });

      // Save user to database
      await user.save();

      // Create JWT payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign and return token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Registration error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   POST api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      console.log('Login attempt:', email);
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Update last login
      user.lastLogin = Date.now();
      await user.save();

      // Create JWT payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign and return token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          console.log(token);
          
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   GET api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;
    const userData = user.toObject();
    userData.bmi = user.calculateBMI();
    userData.progressPercentage = user.calculateProgress();
    console.log('userData:', userData);
    
    res.json(userData);
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/auth/me
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/me',
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
// Add these new routes to the existing auth.js file

/**
 * @route   GET api/auth/weight
 * @desc    Get user's weight history
 * @access  Private
 */
router.get('/weight', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('weightHistory');
    res.json(user.weightHistory);
  } catch (err) {
    console.error('Get weight history error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST api/auth/weight
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
 * @route   GET api/auth/shipments
 * @desc    Get user's shipments
 * @access  Private
 */
router.get('/shipments', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('shipments');
    res.json(user.shipments);
  } catch (err) {
    console.error('Get shipments error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
