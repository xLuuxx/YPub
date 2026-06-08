const { z } = require('zod');
const pool = require('../db/index');

const VALID_CATEGORIES = ['Signature', 'Fruité', 'Sans alcool', 'Classique'];

const cocktailSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  category: z.enum(['Signature', 'Fruité', 'Sans alcool', 'Classique'], { message: 'Catégorie invalide' }),
  price: z.number({ invalid_type_error: 'Prix invalide' }).positive('Le prix doit être positif'),
  description: z.string().optional().nullable(),
  available: z.boolean().default(true),
  origin: z.string().max(100).optional().nullable(),
  image: z.string().optional().nullable(),
  story: z.string().optional().nullable(),
  ingredients: z.array(z.string().min(1)).default([]),
});

const COCKTAILS_WITH_INGREDIENTS = `
  SELECT
    c.id, c.name, c.category, c.price::float, c.description,
    c.available, c.origin, c.image, c.story, c.created_at,
    COALESCE(
      json_agg(i.name ORDER BY i.id) FILTER (WHERE i.id IS NOT NULL),
      '[]'
    ) AS ingredients
  FROM cocktails c
  LEFT JOIN ingredients i ON i.cocktail_id = c.id
`;

async function getCocktails(req, res) {
  const { category, ingredient } = req.query;

  try {
    let where = 'WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      where += ` AND c.category = $${params.length}`;
    }

    if (ingredient) {
      params.push(`%${ingredient.toLowerCase()}%`);
      where += ` AND c.id IN (
        SELECT cocktail_id FROM ingredients WHERE LOWER(name) LIKE $${params.length}
      )`;
    }

    const { rows } = await pool.query(
      `${COCKTAILS_WITH_INGREDIENTS} ${where} GROUP BY c.id ORDER BY c.created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function getCocktail(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `${COCKTAILS_WITH_INGREDIENTS} WHERE c.id = $1 GROUP BY c.id`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Cocktail introuvable' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function createCocktail(req, res) {
  const parsed = cocktailSchema.safeParse(req.body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => i.message);
    return res.status(400).json({ error: messages[0], details: messages });
  }

  const { ingredients, ...fields } = parsed.data;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO cocktails (name, category, price, description, available, origin, image, story)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [fields.name, fields.category, fields.price, fields.description,
       fields.available, fields.origin, fields.image, fields.story]
    );
    const cocktailId = rows[0].id;

    for (const name of ingredients) {
      await client.query('INSERT INTO ingredients (cocktail_id, name) VALUES ($1, $2)', [cocktailId, name]);
    }

    await client.query('COMMIT');

    const { rows: full } = await pool.query(
      `${COCKTAILS_WITH_INGREDIENTS} WHERE c.id = $1 GROUP BY c.id`,
      [cocktailId]
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

async function updateCocktail(req, res) {
  const { id } = req.params;
  const parsed = cocktailSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => i.message);
    return res.status(400).json({ error: messages[0], details: messages });
  }

  const { ingredients, ...fields } = parsed.data;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM cocktails WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Cocktail introuvable' });
    }

    const setClauses = [];
    const params = [];
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        params.push(value);
        setClauses.push(`${key} = $${params.length}`);
      }
    }

    if (setClauses.length > 0) {
      params.push(id);
      await client.query(
        `UPDATE cocktails SET ${setClauses.join(', ')} WHERE id = $${params.length}`,
        params
      );
    }

    if (ingredients !== undefined) {
      await client.query('DELETE FROM ingredients WHERE cocktail_id = $1', [id]);
      for (const name of ingredients) {
        await client.query('INSERT INTO ingredients (cocktail_id, name) VALUES ($1, $2)', [id, name]);
      }
    }

    await client.query('COMMIT');

    const { rows } = await pool.query(
      `${COCKTAILS_WITH_INGREDIENTS} WHERE c.id = $1 GROUP BY c.id`,
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    client.release();
  }
}

async function deleteCocktail(req, res) {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM cocktails WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Cocktail introuvable' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getCocktails, getCocktail, createCocktail, updateCocktail, deleteCocktail };
