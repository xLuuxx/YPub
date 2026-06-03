const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const pool = require('../db/index');

const identifierSchema = z.string().regex(/^[a-zA-Z0-9]{8,12}$/, 'Identifiant : 8 à 12 caractères alphanumériques');

const passwordSchema = z.string()
  .min(12, 'Mot de passe : 12 caractères minimum')
  .max(64, 'Mot de passe : 64 caractères maximum')
  .regex(/[A-Z]/, 'Mot de passe : au moins 1 majuscule')
  .regex(/[0-9]/, 'Mot de passe : au moins 1 chiffre')
  .regex(/[^a-zA-Z0-9]/, 'Mot de passe : au moins 1 caractère spécial');

const registerSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

function signToken(user) {
  return jwt.sign(
    { id: user.id, identifier: user.identifier, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => i.message);
    return res.status(400).json({ error: messages[0], details: messages });
  }

  const { identifier, password } = parsed.data;

  try {
    const existing = await pool.query('SELECT id FROM users WHERE identifier = $1', [identifier]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Cet identifiant est déjà utilisé' });
    }

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'INSERT INTO users (identifier, password, role) VALUES ($1, $2, $3) RETURNING id, identifier, role',
      [identifier, hash, 'user']
    );

    const user = rows[0];
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
  }

  const { identifier, password } = parsed.data;

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE identifier = $1', [identifier]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ token: signToken(safeUser), user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { register, login };
