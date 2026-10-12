const express = require('express');
const cookieParser = require('cookie-parser');
const corsMiddleware = require('./middleware/cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Security and utility middleware
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome check
app.get('/', (req, res) => {
  res.json({
    name: 'SkyPlan API',
    description: 'Weather-Based Activity Planner Backend Service',
    docs: '/api/health',
  });
});

// Mount API routes (handles standard Express, Netlify redirects, and direct serverless invocation)
app.use('/api', routes);
app.use('/.netlify/functions/api', routes);
app.use('/', routes);


// 404 handler for unmatched routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
