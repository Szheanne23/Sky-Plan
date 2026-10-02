const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  db: {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT, 10) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'skyplan_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'skyplan_development_jwt_secret_placeholder',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  openWeatherMap: {
    apiKey: process.env.OPENWEATHERMAP_API_KEY || '',
  },
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};

module.exports = config;
