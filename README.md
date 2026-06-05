# Y'Pub - Plateforme de commande de cocktails

## Description

Y'Pub est une application web full-stack permettant aux clients de consulter une carte de cocktails et de passer des commandes en ligne. Les administrateurs peuvent gérer la carte, les commandes et les utilisateurs via un panel d’administration.

### Stack technique

- Backend : Node.js + Express + PostgreSQL
- Frontend : React + Vite + Tailwind CSS
- Conteneurisation : Docker + Docker Compose

---

## Architecture

Le projet est organisé en 3 conteneurs Docker :

1. `ypub-db` - Base de données PostgreSQL
2. `ypub-backend` - API REST Node.js / Express
3. `ypub-frontend` - Application React / Vite

### Structure du projet

```text
YPub/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── db/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── lib/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

---

## Installation

### Prérequis

- Docker Desktop installé
- PowerShell ou un terminal compatible
- Environ 8 GB de RAM disponibles

### 1. Se placer dans le projet

```bash
git clone https://github.com/xLuuxx/YPub.git
cd D:\Bureau\YPub
```

### 2. Créer le fichier `.env`

Crée un fichier `.env` à la racine du projet avec vos informations :

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ypub
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
```

### 3. Lancer l’application

```bash
docker compose down -v
docker compose up --build
```

### 4. Accéder à l’application

- Frontend : [http://localhost:5173](http://localhost:5173)
- Backend API : [http://localhost:3000](http://localhost:3000)
- PostgreSQL : `localhost:5432`

---

## Comptes par défaut

### Administrateur

- Identifiant : `admin001`
- Mot de passe : `Admin@12345!`
- Accès : panel d’administration complet

### Créer un compte utilisateur

Rends-toi sur [http://localhost:5173/register](http://localhost:5173/register), puis remplis le formulaire avec :

- Identifiant : 8 à 12 caractères alphanumériques
- Mot de passe : minimum 12 caractères, avec au moins 1 majuscule, 1 chiffre et 1 caractère spécial


---

## Remplir la base de données

### Ajouter des cocktails avec SQL

Les images ne sont pas représentatives des cocktails mais permettent de donner une idée.

```bash
docker exec -it ypub-db psql -U postgres -d ypub -c "
INSERT INTO cocktails (name, category, price, description, available, origin, image, story) VALUES
('Mojito', 'Classique', 8.50, 'Rhum blanc, menthe fraîche, citron', true, 'Cuba', 'https://www.thecocktaildb.com/images/media/drink/metwgh1504820468.jpg', 'Un classique incontournable'),
('Margarita', 'Classique', 9.00, 'Tequila, triple sec, jus de citron', true, 'Mexique', 'https://www.thecocktaildb.com/images/media/drink/trsush0054a6b4.jpg', 'Le roi des cocktails'),
('Piña Colada', 'Fruité', 10.00, 'Rhum blanc, jus de coco, ananas', true, 'Porto Rico', 'https://www.thecocktaildb.com/images/media/drink/q54keg1504820558.jpg', 'Tropical et gourmand'),
('Daïquiri', 'Classique', 8.00, 'Rhum blanc, jus de citron frais, sucre', true, 'Cuba', 'https://www.thecocktaildb.com/images/media/drink/0zfsz91592792790.jpg', 'Simpliste et délicieux'),
('Sex on the Beach', 'Fruité', 9.50, 'Vodka, liqueur de cranberry, jus d''orange', true, 'USA', 'https://www.thecocktaildb.com/images/media/drink/rvhrnq1550876961.jpg', 'Fruité et sucré'),
('Cosmopolitan', 'Signature', 10.50, 'Vodka, triple sec, jus de cranberry', true, 'USA', 'https://www.thecocktaildb.com/images/media/drink/m03zvf1504476151.jpg', 'Tendance et chic'),
('Virgin Mojito', 'Sans alcool', 5.00, 'Menthe fraîche, citron, sucre, eau gazeuse', true, 'Cuba', 'https://www.thecocktaildb.com/images/media/drink/16342pv1487603212.jpg', 'Frais et désaltérant'),
('Virgin Colada', 'Sans alcool', 6.00, 'Jus de coco, ananas, crème', true, 'Porto Rico', 'https://www.thecocktaildb.com/images/media/drink/m1f9s51504822754.jpg', 'Tropical sans alcool');
"
```

### Ajouter des cocktails via le panel admin

1. Connecte-toi avec le compte administrateur.
2. Clique sur **Admin** dans le header.
3. Va dans **Cocktails**.
4. Clique sur **Ajouter un cocktail**.
5. Remplis le formulaire et ajoute une image locale.

---

## Fonctionnalités

### Côté client

- Consulter la carte des cocktails
- Filtrer par catégorie
- Passer des commandes
- Consulter l’historique des commandes
- Gérer son profil

### Côté administrateur

- Gérer la carte des cocktails
- Ajouter, modifier et supprimer des cocktails
- Uploader des images
- Gérer les commandes
- Gérer les utilisateurs
- Assigner les rôles `user`, `staff` et `admin`

---

## Authentification

- Authentification par JWT
- Jetons stockés dans le `localStorage`
- Durée de validité : 7 jours
- Authentification requise pour passer une commande
- Seuls les administrateurs peuvent gérer la carte

---

## Endpoints principaux

### Authentification

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Cocktails

- `GET /api/cocktails` - Liste des cocktails
- `GET /api/cocktails/:id` - Détails d’un cocktail
- `POST /api/cocktails` - Création (admin uniquement)
- `PATCH /api/cocktails/:id` - Modification (admin uniquement)
- `DELETE /api/cocktails/:id` - Suppression (admin uniquement)

### Commandes

- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `PATCH /api/orders/:id` - Modifier le statut
- `DELETE /api/orders/:id` - Annuler une commande

### Upload

- `POST /api/upload/cocktail-image` - Upload d’image

---

## Dépannage

### Les conteneurs ne démarrent pas

```bash
docker compose down -v
docker system prune -a
docker compose up --build
```

### Port déjà utilisé

```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Les images ne s’affichent pas

Vérifie que les URLs commencent bien par :

- `http://localhost:3000/`
- ou `/`

### Erreur lors de l’upload

Vérifie que :

- l’image fait moins de 5 MB
- le format est autorisé : JPG, PNG, WebP, GIF

---

## Commandes utiles

### Lancer les conteneurs

```bash
docker compose up --build
```

### Arrêter les conteneurs

```bash
docker compose down
```

### Voir les logs

```bash
docker logs ypub-backend -f
docker logs ypub-frontend -f
docker logs ypub-db -f
```

### Accéder à PostgreSQL

```bash
docker exec -it ypub-db psql -U postgres -d ypub
```

### Redémarrer un conteneur

```bash
docker compose restart [nomconteneur]
```

### Supprimer les volumes

```bash
docker compose down -v
```

---

## Sauvegarde et restauration

### Sauvegarder la base

```bash
docker exec -t ypub-db pg_dump -U postgres ypub > backup.sql
```

### Restaurer la base

```bash
cat backup.sql | docker exec -i ypub-db psql -U postgres -d ypub
```

---

## Uploads

Les images uploadées sont stockées dans le conteneur backend dans :

```text
/app/uploads
```

Elles sont servies depuis une URL de type :

```text
http://localhost:3000/cocktail-*.png
http://localhost:3000/cocktail-*.jpg
http://localhost:3000/cocktail-*.webp
http://localhost:3000/cocktail-*.gif
```

---


## Support

En cas de problème :

1. Vérifie que tous les conteneurs sont lancés.
2. Consulte les logs avec `docker logs <conteneur>`.
3. Vérifie la présence du fichier `.env`.
4. Teste directement l’API sur [http://localhost:3000/api/cocktails](http://localhost:3000/api/cocktails).

---

## Licence

Projet Y'Pub - Tous droits réservés  
Made By. Mattéo & Laurine