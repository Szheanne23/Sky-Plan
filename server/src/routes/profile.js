const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const interestController = require('../controllers/interestController');
const { authenticateToken } = require('../middleware/auth');

// All profile routes require authentication
router.use(authenticateToken);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.get('/interests', interestController.getUserInterests);
router.put('/interests', interestController.updateUserInterests);

module.exports = router;
