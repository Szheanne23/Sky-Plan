const express = require('express');
const router = express.Router();
const { testConnection } = require('../config/db');

router.get('/health', async (req, res) => {
  const dbStatus = await testConnection();

  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      service: 'SkyPlan Backend API',
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus,
    },
    message: 'SkyPlan API is running successfully.',
  });
});

module.exports = router;
