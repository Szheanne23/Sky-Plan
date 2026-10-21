const pool = require('../config/db');
const { hashPassword } = require('../utils/password');

async function seedTestUser() {
  const email = 'testuser@skyplan.test';
  const password = 'Password123!';
  const displayName = 'Test Explorer';

  const hash = await hashPassword(password);
  const userRes = await pool.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, 'USER')
     ON CONFLICT (email) DO UPDATE SET password_hash = $2
     RETURNING id, email, role`,
    [email, hash]
  );

  const userId = userRes.rows[0].id;
  await pool.query(
    `INSERT INTO profiles (user_id, display_name)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET display_name = $2`,
    [userId, displayName]
  );

  console.log(`Successfully prepared test user: ${email} with password: ${password}`);
  process.exit(0);
}

seedTestUser().catch((err) => {
  console.error('Failed to seed test user:', err);
  process.exit(1);
});
