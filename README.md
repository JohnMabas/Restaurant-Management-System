# Restaurant Management System

A full-stack Restaurant Management System built with Node.js / Express / PostgreSQL (backend) and React / Vite / Tailwind CSS (frontend).

---

## Project Structure

```
restaurant-management-system/
├── backend/          # Express API + Sequelize + PostgreSQL
└── frontend/         # React + Vite + Tailwind CSS
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL running locally
- npm

---

## 1 — Database Setup

1. Create a PostgreSQL database (e.g. `restaurant_db`).
2. Open `backend/.env` and set your credentials:

```env
DB_NAME=restaurant_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
PORT=5000
```

3. Run migrations to create the tables:

```bash
cd backend
npx sequelize-cli db:migrate
```

4. Seed sample data:

```bash
npx sequelize-cli db:seed:all
```

---

## 2 — Start the Backend

```bash
cd backend
npm install
npm start        # or: node server.js
```

The API will be available at **http://localhost:5000**.

### API Endpoints

| Resource     | Endpoint                  | Methods                    |
|--------------|---------------------------|----------------------------|
| Users        | `/api/users`              | GET, POST                  |
| User         | `/api/users/:id`          | GET, PUT, DELETE           |
| Categories   | `/api/categories`         | GET, POST                  |
| Category     | `/api/categories/:id`     | GET, PUT, DELETE           |
| Menu Items   | `/api/menu-items`         | GET, POST                  |
| Menu Item    | `/api/menu-items/:id`     | GET, PUT, DELETE           |
| Orders       | `/api/orders`             | GET, POST                  |
| Order        | `/api/orders/:id`         | GET, PUT, DELETE           |
| Order Items  | `/api/order-items`        | GET                        |
| Order Item   | `/api/order-items/:id`    | GET, PUT, DELETE           |

---

## 3 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will open at **http://localhost:5173**.

> The Vite dev server proxies `/api/*` requests to `http://localhost:5000` automatically — no CORS issues.

---

## Frontend Pages

| Page            | Route          | Description                                              |
|-----------------|----------------|----------------------------------------------------------|
| Menu            | `/`            | Browse all menu items, filter by category, full CRUD     |
| Categories      | `/categories`  | Manage categories — create, edit, delete                 |
| Orders          | `/orders`      | View all orders, see item details, update status, delete |
| New Order       | `/orders/new`  | Select customer, pick items with quantity, place order   |
| Users           | `/users`       | Manage users — create, edit, delete                      |

---

## Data Flow

```
PostgreSQL
    ↓
Express REST API  (port 5000)
    ↓
React Frontend    (port 5173)
    ↓
User
```

---

## Production Build

```bash
cd frontend
npm run build     # outputs to frontend/dist/
```

Serve `dist/` with any static file server, pointing `/api` at your backend.

---

## How the Backend is Connected to the Frontend

```
React (port 5173)  →  Vite Proxy  →  Express API (port 5000)  →  PostgreSQL
```

### 1. Frontend makes API calls via Axios (`src/services/api.js`)

An Axios instance is created with `baseURL: '/api'` — a relative path, not hardcoded to any server:

```js
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});
```

Every function in `api.js` (e.g. `getOrders()`, `createMenuItem()`) calls this instance. Pages import these functions and use them to read/write data.

### 2. Vite dev server proxies `/api` to the backend (`vite.config.js`)

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
},
```

When the frontend makes a request to `/api/orders`, Vite intercepts it and forwards it to `http://localhost:5000/api/orders`. This is why there are no CORS issues in development — the browser never talks to port 5000 directly.

### 3. Express handles the routes (`server.js`)

```js
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
```

Each route maps to a controller that queries the database. `cors()` is also enabled for direct calls and production use.

### 4. Backend connects to PostgreSQL (`config/database.js`)

```js
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, port: process.env.DB_PORT, dialect: 'postgres' }
);
```

Credentials are loaded from `backend/.env`. Sequelize authenticates the connection before the server starts listening.

### Connection Layer Summary

| Layer | Tool | Key detail |
|---|---|---|
| Frontend HTTP | Axios | `baseURL: '/api'` (relative path) |
| Dev proxy | Vite | `/api` → `http://localhost:5000` |
| Backend routing | Express | Registers all `/api/*` routes |
| ORM / DB | Sequelize + PostgreSQL | Credentials from `backend/.env` |

> **Note:** The Vite proxy is only active during development (`npm run dev`). In production, you need a reverse proxy (e.g. Nginx) to forward `/api` requests to the backend, since the Vite dev server is not used for production builds.
# Restaurant-Management-System
