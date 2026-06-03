const { z } = require('zod');
const pool = require('../db/index');

const VALID_STATUSES = ['pending', 'preparing', 'served'];

const orderSchema = z.object({
  table_num: z.string().min(1, 'Numéro de table requis').max(20),
  items: z.array(z.object({
    cocktail_id: z.number().int().positive(),
    quantity: z.number().int().positive().default(1),
  })).min(1, 'Au moins un cocktail requis'),
});

const ORDERS_QUERY = `
  SELECT
    o.id,
    o.table_num,
    o.status,
    o.created_at,
    o.updated_at,
    o.user_id,
    u.identifier AS user_identifier,
    COALESCE(
      json_agg(
        json_build_object(
          'id', oi.id,
          'cocktail_id', oi.cocktail_id,
          'cocktail_name', c.name,
          'quantity', oi.quantity
        ) ORDER BY oi.id
      ) FILTER (WHERE oi.id IS NOT NULL),
      '[]'
    ) AS items
  FROM orders o
  LEFT JOIN users u ON u.id = o.user_id
  LEFT JOIN order_items oi ON oi.order_id = o.id
  LEFT JOIN cocktails c ON c.id = oi.cocktail_id
`;

async function getOrders(req, res) {
  const { status, table } = req.query;
  const params = [];
  const conditions = [];

  if (req.user.role === 'user') {
    params.push(req.user.id);
    conditions.push(`o.user_id = $${params.length}`);
  }

  if (status) {
    params.push(status);
    conditions.push(`o.status = $${params.length}`);
  }

  if (table) {
    params.push(`%${table}%`);
    conditions.push(`o.table_num ILIKE $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const { rows } = await pool.query(
      `${ORDERS_QUERY} ${where} GROUP BY o.id, u.identifier ORDER BY o.created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function getOrder(req, res) {
  const { id } = req.params;
  const params = [id];
  let extra = '';

  if (req.user.role === 'user') {
    params.push(req.user.id);
    extra = `AND o.user_id = $2`;
  }

  try {
    const { rows } = await pool.query(
      `${ORDERS_QUERY} WHERE o.id = $1 ${extra} GROUP BY o.id, u.identifier`,
      params
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function createOrder(req, res) {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => i.message);
    return res.status(400).json({ error: messages[0], details: messages });
  }

  const { table_num, items } = parsed.data;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'INSERT INTO orders (user_id, table_num, status) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, table_num, 'pending']
    );
    const orderId = rows[0].id;

    for (const { cocktail_id, quantity } of items) {
      const cocktail = await client.query('SELECT id FROM cocktails WHERE id = $1', [cocktail_id]);
      if (cocktail.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Cocktail ${cocktail_id} introuvable` });
      }
      await client.query(
        'INSERT INTO order_items (order_id, cocktail_id, quantity) VALUES ($1, $2, $3)',
        [orderId, cocktail_id, quantity]
      );
    }

    await client.query('COMMIT');

    const { rows: full } = await pool.query(
      `${ORDERS_QUERY} WHERE o.id = $1 GROUP BY o.id, u.identifier`,
      [orderId]
    );
    res.status(201).json(full[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    client.release();
  }
}

async function updateOrder(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide (pending | preparing | served)' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [status, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Commande introuvable' });

    const { rows: full } = await pool.query(
      `${ORDERS_QUERY} WHERE o.id = $1 GROUP BY o.id, u.identifier`,
      [id]
    );
    res.json(full[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function deleteOrder(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT id, user_id, status FROM orders WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Commande introuvable' });

    const order = rows[0];
    const isOwner = order.user_id === req.user.id;
    const isStaff = ['admin', 'staff'].includes(req.user.role);

    if (!isStaff && !(isOwner && order.status === 'pending')) {
      return res.status(403).json({ error: 'Annulation impossible' });
    }

    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getOrders, getOrder, createOrder, updateOrder, deleteOrder };
