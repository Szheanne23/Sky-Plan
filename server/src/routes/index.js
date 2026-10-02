const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const interestsRoutes = require('./interests');

// Mount API routes
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/interests', interestsRoutes);

module.exports = router;
