const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const authController = require('../controllers/authController');

router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  validate,
  authController.login
);

router.get('/me', auth, authController.getProfile);

router.put(
  '/me',
  [
    auth,
    check('firstName', 'First name is required').optional().not().isEmpty(),
    check('lastName', 'Last name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('currentWeight', 'Current weight must be a number').optional().isNumeric(),
    check('goalWeight', 'Goal weight must be a number').optional().isNumeric(),
    check('height', 'Height must be a number').optional().isNumeric()
  ],
  validate,
  authController.updateProfile
);

module.exports = router;