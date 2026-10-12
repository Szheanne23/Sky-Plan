const cors = require('cors');
const config = require('../config/env');

const corsOptions = {
  origin: (origin, callback) => {
    // Collect allowed origins from config.clientOrigin (handles comma-separated list and whitespace)
    const configuredOrigins = (config.clientOrigin || '')
      .split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean);

    const allowedOrigins = [
      ...configuredOrigins,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
    ];

    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : null;

    const isNetlifyOrigin =
      normalizedOrigin &&
      (normalizedOrigin.endsWith('.netlify.app') ||
        normalizedOrigin.includes('netlify.app') ||
        Boolean(process.env.NETLIFY));

    if (
      !normalizedOrigin ||
      allowedOrigins.includes(normalizedOrigin) ||
      isNetlifyOrigin ||
      allowedOrigins.includes('*') ||
      process.env.NODE_ENV === 'production'
    ) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


module.exports = cors(corsOptions);
