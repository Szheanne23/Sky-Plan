const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { optionalAuthenticate } = require('../middleware/auth');

// Recommendations evaluate weather + interest rules (works for guests with general suggestions, tailored for logged-in users)
router.get('/', optionalAuthenticate, recommendationController.getRecommendations);

module.exports = router;
