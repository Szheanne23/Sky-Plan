const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { authenticateToken } = require('../middleware/auth');

// Search history requires authenticated user
router.use(authenticateToken);

router.get('/', historyController.getSearchHistory);
router.delete('/', historyController.clearSearchHistory);

module.exports = router;
