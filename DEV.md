# DEV.md — YPub Bar API

## Architecture

### Frontend (React + Vite + Tailwind + React Router v6)

Deux branches frontend fusionnées : `feat/frontend/admin` (panel admin) + `feat/frontend/clients` (page client).

**Routes finales :**
- `/` — page d'accueil publique (carte cocktails)
- `/login` — connexion client
- `/register` — inscription client
- `/profile` — historique commandes client (auth requise)
- `/admin/login` — connexion admin/staff
- `/admin` — dashboard (auth admin/staff requise)
- `/admin/orders` — gestion commandes
- `/admin/cocktails` — gestion carte

---

## Structures de données

### Commande
```json
{
  "id": "CMD-0042",
  "table_num": "Table 03",
  "status": "pending",
  "created_at": "...",
  "items": [
    { "cocktail_id": 1, "cocktail_name": "Violet Spritz", "quantity": 2 }
  ]
}
```
Statuts : `pending` → `preparing` → `served`

### Cocktail
```json
{
  "id": 1,
  "name": "Violet Spritz",
  "category": "Signature",
  "price": 8.50,
  "description": "Cocktail pétillant et floral.",
  "available": true,
  "origin": "France",
  "image": "https://...",
  "story": "Un cocktail pétillant...",
  "ingredients": ["Liqueur florale", "Citron", "Eau pétillante"]
}
```
Catégories : `Signature` / `Fruité` / `Sans alcool` / `Classique`

---

## Schéma BDD

```sql
users
  id          SERIAL PRIMARY KEY
  identifier  VARCHAR(12) UNIQUE NOT NULL  -- alphanumérique 8-12 chars
  password    TEXT NOT NULL                -- bcrypt hash
  role        VARCHAR(10) NOT NULL DEFAULT 'user'  -- 'admin' | 'staff' | 'user'
  created_at  TIMESTAMPTZ DEFAULT NOW()

cocktails
  id          SERIAL PRIMARY KEY
  name        VARCHAR(100) NOT NULL
  category    VARCHAR(50) NOT NULL
  price       NUMERIC(10,2) NOT NULL
  description TEXT
  available   BOOLEAN DEFAULT TRUE
  origin      VARCHAR(100)
  image       TEXT
  story       TEXT
  created_at  TIMESTAMPTZ DEFAULT NOW()

ingredients
  id            SERIAL PRIMARY KEY
  cocktail_id   INT REFERENCES cocktails(id) ON DELETE CASCADE
  name          VARCHAR(100) NOT NULL

orders
  id          SERIAL PRIMARY KEY
  user_id     INT REFERENCES users(id)
  table_num   VARCHAR(20) NOT NULL
  status      VARCHAR(20) NOT NULL DEFAULT 'pending'
  created_at  TIMESTAMPTZ DEFAULT NOW()
  updated_at  TIMESTAMPTZ DEFAULT NOW()

order_items
  id          SERIAL PRIMARY KEY
  order_id    INT REFERENCES orders(id) ON DELETE CASCADE
  cocktail_id INT REFERENCES cocktails(id)
  quantity    INT NOT NULL DEFAULT 1
```

---

## Endpoints

### Auth
- `POST /api/auth/register` — `{ identifier, password }` → `{ token, user }`
- `POST /api/auth/login` — `{ identifier, password }` → `{ token, user }`

### Users (admin)
- `GET /api/users`
- `POST /api/users` — `{ identifier, password, role }`
- `PATCH /api/users/:id` — `{ role }`
- `DELETE /api/users/:id`

### Cocktails
- `GET /api/cocktails` — `?category=&ingredient=`
- `GET /api/cocktails/:id`
- `POST /api/cocktails` — admin
- `PUT /api/cocktails/:id` — admin
- `DELETE /api/cocktails/:id` — admin

### Orders
- `GET /api/orders` — admin/staff : toutes ; user : les siennes
- `GET /api/orders/:id`
- `POST /api/orders` — auth requise — `{ table_num, items: [{ cocktail_id, quantity }] }`
- `PATCH /api/orders/:id` — staff/admin — `{ status }`
- `DELETE /api/orders/:id` — staff/admin (ou user si pending)

---

## Décisions techniques

- **ORM** : `pg` (node-postgres) — SQL direct, simple
- **Validation** : `zod`
- **JWT** : `jsonwebtoken`, secret dans `.env`
- **Hashing** : `bcrypt`, saltRounds 12
- **Format ID commande** : `CMD-` + ID zero-padded sur 4 chiffres (généré backend)
- **Prix** : `NUMERIC(10,2)` en BDD, `number` dans l'API, formaté côté front
- **Tables** : champ texte libre sur la commande, pas de table dédiée en BDD

---

## Plan d'implémentation

- [x] Phase découverte et analyse du front
- [ ] Setup branche + structure `backend/`
- [ ] Schema SQL + seed
- [ ] Middleware auth + roles
- [ ] Controllers + routes auth
- [ ] Controllers + routes users
- [ ] Controllers + routes cocktails
- [ ] Controllers + routes orders
- [ ] Setup axios + auth context frontend
- [ ] Intégration front admin (login, dashboard, orders, cocktails)
- [ ] Nouvelles pages front client (login, register, profile)
- [ ] Intégration front client (carte, commande, suivi)
- [ ] PrivateRoute admin + client
