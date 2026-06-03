CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  identifier  VARCHAR(12) UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  role        VARCHAR(10) NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cocktails (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  category    VARCHAR(50) NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  description TEXT,
  available   BOOLEAN DEFAULT TRUE,
  origin      VARCHAR(100),
  image       TEXT,
  story       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingredients (
  id          SERIAL PRIMARY KEY,
  cocktail_id INT REFERENCES cocktails(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id),
  table_num   VARCHAR(20) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INT REFERENCES orders(id) ON DELETE CASCADE,
  cocktail_id INT REFERENCES cocktails(id),
  quantity    INT NOT NULL DEFAULT 1
);
