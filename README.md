# 🚗 Haupcar Car Management System

---

## 📋 Prerequisites

- **Node.js**: v18+
- **npm**: v9+

---

## ⚡ Quick Start Guide

### Step 1: Install Dependencies (First-time only)

Open your terminal in the project root:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

---

### Step 2: Initialize Database (Optional / Reset)

The SQLite database `database/car.db` is already pre-seeded with sample cars.  
If you want to reset or re-seed the database at any time:

```bash
node database/init-db.js
```

---

### Step 3: Start the Backend (API Server)

```bash
cd backend
npm run start
```

- **Backend URL**: [http://localhost:3000/api](http://localhost:3000/api)
- **Cars API**: [http://localhost:3000/api/cars](http://localhost:3000/api/cars)

---

### Step 4: Start the Frontend (Web Dashboard)

In a **new terminal window**:

```bash
cd frontend
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

### Step 5: Run Unit Tests

To run the automated test suite:

```bash
cd backend
npm run test
```

---

## 🛠️ API Reference Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cars` | Get all cars (supports `?search=`, `?brand=`, `?status=`) |
| `GET` | `/api/cars/:id` | Get car detail by ID |
| `POST` | `/api/cars` | Add a new car (validates duplicate plate & province) |
| `PUT` | `/api/cars/:id` | Update car details |
| `PATCH` | `/api/cars/:id` | Partial update (e.g. status) |
| `DELETE` | `/api/cars/:id` | Delete car by ID |
