# Multi-Model Logistic Optimizer 🚛💨

A premium, full-stack logistics management platform designed for efficient route optimization, fleet management, and real-time order tracking. Built with a modern tech stack and focusing on a high-end user experience.

---

## ✨ Features

- **🚀 Interactive Dashboard**: Real-time overview of logistics operations with dynamic KPIs and visual status tracking.
- **📊 Advanced Analytics**: Detailed charts and insights powered by Recharts for data-driven decision making.
- **📦 Order Management**: Comprehensive lifecycle tracking from pending to delivered with automated status history.
- **🚚 Fleet & Vehicle Management**: Monitor vehicle status, capacity, and driver assignments with a dedicated "Asset Terminal".
- **📍 Route Visualization**: Intuitive display of pickup-to-delivery paths with distance and time metrics.
- **🔒 Secure Authentication**: Robust JWT-based authentication with Bcrypt password hashing and role-based access control.
- **👤 Profile Management**: User profile customization, security settings, and password updates.
- **🔔 Notifications**: Real-time system notifications for critical logistics updates and order status changes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Context API
- **Routing**: [React Router v7](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Auth**: JWT (JSON Web Tokens) & Bcrypt

---

## 🏗️ Project Structure

```text
multi-model-logistic-optimizer/
├── backend/                # Node.js Express server
│   ├── config/             # Database connection & initialization
│   ├── controllers/        # Business logic & route handlers
│   ├── middleware/         # Auth, security & error handling
│   ├── routes/             # API endpoint definitions
│   ├── schema.sql          # SQL schema for MySQL database
│   └── server.js           # Server entry point
├── frontend/               # React Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Sidebar, Tables)
│   │   ├── context/        # Global state (Auth, Notifications)
│   │   ├── pages/          # Full-page views (Dashboard, Orders, Analytics)
│   │   └── App.jsx         # Main router and layout
│   └── index.html          # Entry HTML
└── package.json            # Project-wide information
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **Package Manager**: npm or yarn
- **Database**: MySQL Server

### Database Setup
1. Create a MySQL database named `logistic_optimizer` (or as specified in your `.env`).
2. Run the automated setup script from the `backend` directory to initialize tables and seed data:
   ```bash
   cd backend
   npm run db:setup
   ```
   *Alternatively, you can manually import the schema:*
   ```bash
   mysql -u your_user -p logistic_optimizer < backend/schema.sql
   ```

### ⚙️ Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `DB_HOST` | MySQL database host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASS` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `logistics_db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_key` |

---

## 📡 API Endpoints (Quick Reference)

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token

### Orders
- `GET /api/orders` - Fetch all orders (protected)
- `POST /api/orders` - Create a new order (protected)
- `GET /api/orders/:id` - Get specific order details
- `POST /api/orders/:id/assign` - Assign vehicle to order

### Vehicles
- `GET /api/vehicles` - Fetch all fleet assets
- `POST /api/vehicles` - Deploy new vehicle asset

---

## 💻 Installation & Development

#### Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run in development mode (nodemon)
npm run dev

# Start production server
npm start
```

#### Frontend
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

---

## 📝 License

This project is licensed under the **ISC License**.

---

Developed with ❤️ by [Neha](https://github.com/Neha91-svg)
