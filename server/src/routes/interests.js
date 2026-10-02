const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');

// Public/authenticated endpoint to list all active system interest tags
router.get('/', interestController.getAllInterests);

module.exports = router;
