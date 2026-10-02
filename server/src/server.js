const app = require('./app');
const config = require('./config/env');
const { testConnection } = require('./config/db');

const PORT = config.port;

const server = app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`🚀 SkyPlan API Server running on port ${PORT}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
  console.log(`🩺 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);

  // Probe database connection upon startup
  const dbStatus = await testConnection();
  if (dbStatus.connected) {
    console.log(`✅ [Database] ${dbStatus.message}`);
  } else {
    console.warn(`⚠️ [Database] ${dbStatus.message}`);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = server;
