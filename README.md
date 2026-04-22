# Multi-Model Logistic Optimizer 🚛💨

A premium, full-stack logistics management platform designed for efficient route optimization, fleet management, and real-time order tracking. Built with a modern tech stack and focusing on a high-end user experience.

---

## ✨ Features

- **🚀 Interactive Dashboard**: Real-time overview of logistics operations with dynamic KPIs.
- **📊 Advanced Analytics**: Detailed charts and insights powered by Recharts.
- **📦 Order Management**: Comprehensive lifecycle tracking from pending to delivered.
- **🚚 Fleet & Vehicle Management**: Monitor vehicle status, capacity, and driver assignments.
- **📍 Route Visualization**: Intuitive display of pickup-to-delivery paths with distance and time metrics.
- **🔒 Secure Authentication**: Robust JWT-based authentication with Bcrypt password hashing.
- **👤 Profile Management**: User profile customization and password updates.
- **🔔 Notifications**: Real-time system notifications for critical updates.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Context API
- **Routing**: React Router v7

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Auth**: JWT (JSON Web Tokens) & Bcrypt

---

## 🏗️ Project Structure

```text
multi-model-logistic-optimizer/
├── backend/                # Node.js Express server
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & security
│   ├── routes/             # API endpoints
│   ├── schema.sql          # Database schema
│   └── server.js           # Entry point
├── frontend/               # React Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state
│   │   ├── pages/          # Full-page views
│   │   └── App.jsx         # Main router
│   └── index.html
└── package.json            # Base configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server

### Database Setup
1. Create a MySQL database named `logistics_db`.
2. Import the schema:
   ```bash
   mysql -u your_user -p logistics_db < backend/schema.sql
   ```

### Backend Installation
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASS=your_password
   DB_NAME=logistics_db
   JWT_SECRET=your_super_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Installation
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📝 License

This project is licensed under the ISC License.

---

Developed with ❤️ by [Neha](https://github.com/Neha91-svg)
