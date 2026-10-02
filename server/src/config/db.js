const { Pool } = require('pg');
const config = require('./env');

let pool = null;

// Initialize PostgreSQL Pool if database configuration is present
try {
  const poolConfig = config.databaseUrl
    ? { connectionString: config.databaseUrl }
    : {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
      };

  pool = new Pool({
    ...poolConfig,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err.message);
  });
} catch (err) {
  console.warn('PostgreSQL pool initialization skipped or deferred:', err.message);
}

/**
 * Tests the database connection safely without crashing the server.
 * @returns {Promise<{ connected: boolean, message: string }>}
 */
async function testConnection() {
  if (!pool) {
    return {
      connected: false,
      message: 'PostgreSQL pool is not initialized. Check database configuration in .env.',
    };
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    return {
      connected: true,
      message: `Database connected successfully at ${result.rows[0].current_time}`,
    };
  } catch (err) {
    return {
      connected: false,
      message: `Database connection probe failed: ${err.message}`,
    };
  }
}

/**
 * Helper to execute parameterized queries.
 * @param {string} text
 * @param {Array} params
 */
async function query(text, params) {
  if (!pool) {
    throw new Error('Database pool is not configured.');
  }
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
  testConnection,
};
