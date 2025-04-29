const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password, initialWeight, goalWeight, height } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorResponse('User already exists', 400));
    }

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

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error('Registration error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    user.lastLogin = Date.now();
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const userData = user.toObject();
    userData.bmi = user.calculateBMI();
    userData.progressPercentage = user.calculateProgress();
    res.json(userData);
  } catch (err) {
    console.error('Get profile error:', err.message);
    next(new ErrorResponse('Server error', 500));
  }
};

exports.updateProfile = async (req, res, next) => {
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
    next(new ErrorResponse('Server error', 500));
  }
};