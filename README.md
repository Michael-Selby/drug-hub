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
Edit `backend/.env` to change the MongoDB URI or port:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/drug_hub_db?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
```
