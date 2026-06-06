# Y'Pub — Plateforme de commande de cocktails

Application web full-stack de gestion de commandes pour un bar. Les clients consultent la carte et passent commande depuis leur table. Le personnel gère les commandes, la carte et les comptes via un panel d'administration.

## Équipe

| Membre | Contribution |
|--------|-------------|
| Mattéo | Développement backend (API REST, base de données) |
| Laurine | Développement frontend, conteneurisation Docker, documentation |

## Stack technique

- **Backend** : Node.js, Express, PostgreSQL
- **Frontend** : React, Vite, Tailwind CSS
- **Conteneurisation** : Docker, Docker Compose

## Architecture

```
        ┌───────────────────┐
        │    Navigateur     │
        └────────┬──────────┘
                 │ :5173
        ┌────────▼──────────┐
        │   ypub-frontend   │  React + Vite
        └────────┬──────────┘
                 │ :3000  (ypub-network)
        ┌────────▼──────────┐
        │   ypub-backend    │  Node.js + Express
        └────────┬──────────┘
                 │ :5432  (ypub-network)
        ┌────────▼──────────┐
        │      ypub-db      │  PostgreSQL
        └───────────────────┘
```

Les trois services sont orchestrés par Docker Compose sur un réseau interne `ypub-network`. Seuls les ports 5173 (frontend) et 3000 (API) sont exposés à l'hôte. Les données PostgreSQL sont persistées via un volume Docker.

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/xLuuxx/YPub.git
cd YPub
```

### 2. Créer le fichier `.env`

```bash
cp .env.example .env   # ou créer manuellement le fichier
```

Contenu minimal :

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ypub
JWT_SECRET=changez-ce-secret-en-production
```

### 3. Lancer l'application

```bash
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173       |
| API      | http://localhost:3000       |

## Compte administrateur par défaut

| Identifiant | Mot de passe   |
|-------------|----------------|
| `admin001`  | `Admin@12345!` |

## Fonctionnalités

**Interface client** (`/`)
- Carte des cocktails avec filtres par catégorie et ingrédient
- Visualisation du détail d'un cocktail (nom, image, histoire, origine, ingrédients)
- Passage de commande avec sélection du numéro de table
- Suivi de l'état de commande depuis le profil (`/profile`)

**Interface administration** (`/admin`)
- Gestion de la carte : ajout, modification, suppression de cocktails, upload d'image
- Gestion des commandes : mise à jour du statut (`reçue → en préparation → servie`), suppression
- Gestion des comptes : création, attribution de rôle (`user`, `staff`, `admin`), suppression

## Endpoints principaux

| Méthode | Route | Accès |
|---------|-------|-------|
| `POST` | `/api/auth/login` | Public |
| `POST` | `/api/auth/register` | Public |
| `GET` | `/api/cocktails` | Public |
| `GET` | `/api/cocktails/:id` | Public |
| `POST` / `PATCH` / `DELETE` | `/api/cocktails` | Admin |
| `GET` / `POST` | `/api/orders` | Auth |
| `PATCH` / `DELETE` | `/api/orders/:id` | Staff / Admin |
| `GET` / `POST` / `PATCH` / `DELETE` | `/api/users` | Admin |
| `POST` | `/api/upload/cocktail-image` | Admin |

## Commandes utiles

```bash
# Arrêter les conteneurs
docker compose down

# Supprimer les volumes (réinitialise la base)
docker compose down -v

# Voir les logs en temps réel
docker logs ypub-backend -f
docker logs ypub-frontend -f

# Accéder à PostgreSQL
docker exec -it ypub-db psql -U postgres -d ypub

# Sauvegarder la base
docker exec -t ypub-db pg_dump -U postgres ypub > backup.sql

# Restaurer la base
cat backup.sql | docker exec -i ypub-db psql -U postgres -d ypub
```

## Données de test

Pour alimenter rapidement la base avec des cocktails :

```bash
docker exec -it ypub-db psql -U postgres -d ypub -c "
INSERT INTO cocktails (name, category, price, description, available, origin, image, story) VALUES
('Mojito', 'Classique', 8.50, 'Rhum blanc, menthe fraîche, citron', true, 'Cuba', 'https://www.thecocktaildb.com/images/media/drink/metwgh1504820468.jpg', 'Un classique incontournable'),
('Piña Colada', 'Fruité', 10.00, 'Rhum blanc, jus de coco, ananas', true, 'Porto Rico', 'https://www.thecocktaildb.com/images/media/drink/q54keg1504820558.jpg', 'Tropical et gourmand'),
('Virgin Mojito', 'Sans alcool', 5.00, 'Menthe fraîche, citron, sucre, eau gazeuse', true, 'Cuba', 'https://www.thecocktaildb.com/images/media/drink/16342pv1487603212.jpg', 'Frais et désaltérant'),
('Cosmopolitan', 'Signature', 10.50, 'Vodka, triple sec, jus de cranberry', true, 'USA', 'https://www.thecocktaildb.com/images/media/drink/m03zvf1504476151.jpg', 'Tendance et chic');
"
```

---

Projet Y'Pub — Mattéo & Laurine
