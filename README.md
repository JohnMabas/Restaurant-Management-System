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

---

### 1. The Frontend Never Talks to the Backend Directly (in Development)

When you run `npm run dev` in the frontend, Vite starts a dev server on **port 5173**. When that server makes an API call, it goes to `/api/...` — a relative URL, not `http://localhost:5000`. So the browser only ever talks to port 5173. Vite is the middleman.

---

### 2. Axios — The HTTP Client (`src/services/api.js`)

All API calls in the frontend go through a single Axios instance:

```js
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});
```

`baseURL: '/api'` means every call is relative:
- `api.get('/orders')` → hits `/api/orders`
- `api.post('/menu-items', data)` → hits `/api/menu-items`

The functions are exported and used by React pages:

```js
export const getOrders    = ()         => api.get('/orders');
export const createOrder  = (data)     => api.post('/orders', data);
export const updateOrder  = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder  = (id)       => api.delete(`/orders/${id}`);
```

A page like `Orders.jsx` simply imports and calls `getOrders()` — it has no knowledge of ports or servers.

---

### 3. Vite Proxy — The Bridge (`vite.config.js`)

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

This is the critical glue in development. When a request hits `/api/*` on port 5173, Vite:
1. Intercepts the request before it leaves the dev server
2. Forwards it to `http://localhost:5000/api/*`
3. Returns the response back to the browser

So `GET /api/orders` on port 5173 becomes `GET http://localhost:5000/api/orders` behind the scenes. The browser sees it as same-origin, so there are zero CORS issues.

---

### 4. Express — Route Handling (`server.js`)

The backend receives the forwarded request. Express is set up like this:

```js
app.use(cors());               // Allow cross-origin (needed in production)
app.use(express.json());       // Parse JSON request bodies

app.use('/api/users',       userRoutes);
app.use('/api/categories',  categoryRoutes);
app.use('/api/menu-items',  menuItemRoutes);
app.use('/api/orders',      orderRoutes);
app.use('/api/order-items', orderItemRoutes);
```

Each `app.use()` delegates to a dedicated router file. For example, a `GET /api/orders` request gets routed to `orderRoutes.js`, which calls the appropriate controller function.

---

### 5. Controllers — The Business Logic

Controllers sit between routes and the database. Example from `orderController.js`:

```js
// GET /api/orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.findAll({ include: [OrderItem, User] });
  res.json(orders);
};
```

They use Sequelize models to query PostgreSQL, then send back JSON. The frontend receives that JSON via Axios and renders it.

---

### 6. Sequelize + PostgreSQL — The Data Layer (`config/database.js`)

```js
const sequelize = new Sequelize(
  process.env.DB_NAME,      // restaurant_db
  process.env.DB_USER,      // postgres
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,   // localhost
    port: process.env.DB_PORT,   // 5432
    dialect: 'postgres',
    logging: false,
  }
);
```

Sequelize is an ORM — it maps JavaScript model classes (`Order`, `MenuItem`, etc.) to PostgreSQL tables. Credentials come from `backend/.env` and are never exposed to the frontend. Before the server starts listening, it calls `sequelize.authenticate()` to verify the DB connection is live.

---

### Full Request Lifecycle — Example: Loading the Orders Page

```
1. User navigates to /orders in the browser

2. React renders Orders.jsx, which calls getOrders()

3. getOrders() → axios.get('/api/orders')
   → browser sends GET /api/orders to port 5173

4. Vite proxy intercepts it
   → forwards to GET http://localhost:5000/api/orders

5. Express matches app.use('/api/orders', orderRoutes)
   → orderRoutes calls orderController.getAllOrders()

6. Controller calls Order.findAll({ include: [...] })
   → Sequelize translates to SQL: SELECT * FROM orders JOIN ...

7. PostgreSQL executes the query, returns rows

8. Sequelize maps rows → JavaScript objects

9. Controller sends res.json(orders) back to Express

10. Express responds to Vite proxy with JSON

11. Vite proxy returns JSON to the browser

12. Axios resolves the promise with the data

13. React sets state, component re-renders with the orders list
```

---

### Connection Layer Summary

| # | Layer | Technology | Role |
|---|---|---|---|
| 1 | HTTP Client | Axios | Makes requests from React using relative `/api` URLs |
| 2 | Dev Bridge | Vite Proxy | Forwards `/api/*` from port 5173 → port 5000 |
| 3 | Web Server | Express | Receives requests, routes them to controllers |
| 4 | Business Logic | Controllers | Queries DB, formats responses |
| 5 | ORM | Sequelize | Translates JS model calls → SQL queries |
| 6 | Database | PostgreSQL | Stores and retrieves all data |

> **Note:** The Vite proxy is only active during development (`npm run dev`). In production, you need a reverse proxy (e.g. Nginx) to forward `/api` requests to the backend, since the Vite dev server is not used for production builds.
