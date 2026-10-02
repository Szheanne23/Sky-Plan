const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');

// Mount foundational routes
router.use('/', healthRoutes);

module.exports = router;
