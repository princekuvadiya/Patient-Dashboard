const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const patientController = require('../controllers/patientController');

router.get('/weight', auth, patientController.getWeightHistory);

router.post(
  '/weight',
  [
    auth,
    check('weight', 'Weight is required').isNumeric(),
    check('date', 'Valid date is required').optional().isISO8601()
  ],
  validate,
  patientController.addWeightEntry
);

router.get('/shipments', auth, patientController.getShipments);

router.post(
  '/shipments',
  [
    auth,
    check('trackingNumber', 'Tracking number is required').not().isEmpty(),
    check('carrier', 'Carrier is required').not().isEmpty(),
    check('estimatedDeliveryDate', 'Valid date is required').isISO8601()
  ],
  validate,
  patientController.addShipment
);

router.post('/seed', auth, patientController.seedData);

// New POST routes for retrieving data by token
router.post('/profile', auth, patientController.getUserProfileByToken);
router.post('/weight-history', auth, patientController.getUserWeightHistoryByToken);
router.post('/shipments-list', auth, patientController.getUserShipmentsByToken);

module.exports = router;