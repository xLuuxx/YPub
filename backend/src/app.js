require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pool = require('./db/index');
const seed = require('./db/seed');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/cocktails', require('./routes/cocktails'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));

app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

const PORT = process.env.PORT || 3000;

async function start() {
  const schema = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
  await pool.query(schema);
  await seed();

  app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
}

start().catch((err) => {
  console.error('Erreur au démarrage :', err);
  process.exit(1);
});