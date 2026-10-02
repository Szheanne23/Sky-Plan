const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function runMigrations() {
  if (!pool) {
    throw new Error('Database pool is not configured. Check DATABASE_URL in .env');
  }

  const client = await pool.connect();

  try {
    console.log('🔄 [Migrations] Starting database migration runner...');

    // 1. Create migrations tracking table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Fetch applied migrations
    const { rows: appliedRows } = await client.query('SELECT filename FROM schema_migrations');
    const appliedSet = new Set(appliedRows.map((r) => r.filename));

    // 3. Read migration files from migrations directory
    const migrationsDir = path.resolve(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('⚠️ [Migrations] No migrations directory found.');
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    let appliedCount = 0;

    for (const file of files) {
      if (!appliedSet.has(file)) {
        console.log(`📦 [Migrations] Applying migration: ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        // Execute migration within a transaction
        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`✅ [Migrations] Applied migration: ${file}`);
          appliedCount++;
        } catch (migrationErr) {
          await client.query('ROLLBACK');
          console.error(`❌ [Migrations] Error applying migration ${file}:`, migrationErr.message);
          throw migrationErr;
        }
      } else {
        console.log(`⏭️ [Migrations] Skipping already applied migration: ${file}`);
      }
    }

    console.log(`✨ [Migrations] Database is up to date (${appliedCount} new migrations applied).`);
  } finally {
    client.release();
  }
}

// Allow running directly via CLI
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration process complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err.message);
      process.exit(1);
    });
}

module.exports = { runMigrations };
