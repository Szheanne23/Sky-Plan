const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { optionalAuthenticate } = require('../middleware/auth');

// Weather routes support guest queries and optionally associate with authenticated user
router.get('/locations', weatherController.searchLocations);
router.get('/current', optionalAuthenticate, weatherController.getCurrentWeather);
router.get('/forecast', optionalAuthenticate, weatherController.getForecast);

module.exports = router;
