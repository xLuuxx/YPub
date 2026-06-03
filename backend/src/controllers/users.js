const bcrypt = require('bcrypt');
const { z } = require('zod');
const pool = require('../db/index');

const identifierSchema = z.string().regex(/^[a-zA-Z0-9]{8,12}$/, 'Identifiant : 8 à 12 caractères alphanumériques');

const passwordSchema = z.string()
  .min(12, 'Mot de passe : 12 caractères minimum')
  .max(64, 'Mot de passe : 64 caractères maximum')
  .regex(/[A-Z]/, 'Mot de passe : au moins 1 majuscule')
  .regex(/[0-9]/, 'Mot de passe : au moins 1 chiffre')
  .regex(/[^a-zA-Z0-9]/, 'Mot de passe : au moins 1 caractère spécial');

const VALID_ROLES = ['user', 'staff', 'admin'];

async function getUsers(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, identifier, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function createUser(req, res) {
  const schema = z.object({
    identifier: identifierSchema,
    password: passwordSchema,
    role: z.enum(['user', 'staff', 'admin']).default('user'),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => i.message);
    return res.status(400).json({ error: messages[0], details: messages });
  }

  const { identifier, password, role } = parsed.data;

  try {
    const existing = await pool.query('SELECT id FROM users WHERE identifier = $1', [identifier]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Cet identifiant est déjà utilisé' });
    }

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'INSERT INTO users (identifier, password, role) VALUES ($1, $2, $3) RETURNING id, identifier, role, created_at',
      [identifier, hash, role]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, identifier, role',
      [role, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;

  if (Number(id) === req.user.id) {
    return res.status(400).json({ error: 'Impossible de supprimer son propre compte' });
  }

  try {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getUsers, createUser, updateUser, deleteUser };
