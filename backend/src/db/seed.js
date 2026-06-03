const bcrypt = require('bcrypt');
const pool = require('./index');

const DEFAULT_ADMIN = {
  identifier: 'admin001',
  password: 'Admin@12345!',
  role: 'admin',
};

async function seed() {
  const { rows } = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (rows.length > 0) return;

  const hash = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
  await pool.query(
    'INSERT INTO users (identifier, password, role) VALUES ($1, $2, $3)',
    [DEFAULT_ADMIN.identifier, hash, DEFAULT_ADMIN.role]
  );

  console.log('Admin par défaut créé :');
  console.log(`  Identifiant : ${DEFAULT_ADMIN.identifier}`);
  console.log(`  Mot de passe : ${DEFAULT_ADMIN.password}`);
}

module.exports = seed;
