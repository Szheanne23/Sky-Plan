const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const interestsRoutes = require('./interests');
const weatherRoutes = require('./weather');
const recommendationsRoutes = require('./recommendations');
const favoritesRoutes = require('./favorites');
const historyRoutes = require('./history');
const adminRoutes = require('./admin');
const itineraryRoutes = require('./itineraries');

// Mount API routes
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/interests', interestsRoutes);
router.use('/weather', weatherRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/history', historyRoutes);
router.use('/admin', adminRoutes);
router.use('/itineraries', itineraryRoutes);

module.exports = router;

