# Imposter Game Backend (Node.js)

Express REST API with MongoDB for the Imposter word game.

## Structure (MVC)
```
src/
├── models/          # Data access layer (MongoDB + in-memory rooms)
├── controllers/     # Business logic
├── routes/          # HTTP endpoints
├── database.js      # MongoDB connection
└── server.js        # App setup + route registration
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `.env`:
```
DB_URI=mongodb://localhost:27017
PORT=8000
```

3. Run locally:
```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

## Docker

Build:
```bash
docker build -t imposter-node:latest .
```

Run:
```bash
docker run --network host imposter-node:latest
```

## Endpoints

**Auth**
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login

**Game**
- `POST /game/start` - Start local game
- `GET /words/:category` - Get words by category

**Room (Multiplayer)**
- `POST /room/create` - Create room with code
- `POST /room/join` - Join room by code
- `GET /room/:code` - Get room state
- `POST /room/:code/start` - Start game in room
- `POST /room/score` - Submit player score
