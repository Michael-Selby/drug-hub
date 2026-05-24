# Drug Hub — Drug Store Management System

A full-stack MERN application for managing a drug store inventory with expiry alerts.

## Tech Stack
- **MongoDB** — database
- **Express.js** — REST API
- **React.js** — frontend (Create React App + TailwindCSS)
- **Node.js** — server runtime

## Features
- Add, edit, delete drugs (full CRUD)
- Search by name, generic name, or batch number
- Filter by category
- Sortable inventory table
- Expiry alerts (critical ≤ 7 days, warning ≤ 30 days)
- Dashboard statistics (total, expiring, expired, inventory value)

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account with a valid connection string

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Server starts at `http://localhost:5000`

### 2. Frontend
```bash
cd frontend
npm install
npm start
```
App opens at `http://localhost:3000`

## Environment Variables

**Backend** (`backend/.env`):
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/drug_hub_db?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://drug-hub-frontend.onrender.com
```

**Frontend** (`frontend/.env`):
```
REACT_APP_API_URL=https://drug-hub-backend.onrender.com
```

## Deploying to Render

A `render.yaml` blueprint is included — both services deploy from one repo.

### Steps
1. Push repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo — Render auto-detects `render.yaml`
4. Deploy the **backend** first and copy its URL (e.g. `https://drug-hub-backend.onrender.com`)
5. Set these env vars on **each service** in the Render dashboard:

**Backend service env vars:**
| Key | Value |
|-----|-------|
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | Any long secret string |
| `FRONTEND_URL` | Your frontend Render URL |

**Frontend service env vars:**
| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | Your backend Render URL |

6. Trigger a redeploy on the frontend after setting `REACT_APP_API_URL`
