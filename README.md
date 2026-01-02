# Gujarati Divyang (Kesh Rasayana) - Full Stack Project

This project follows a professional full-stack architecture, separating the backend (Server) from the frontend (Client) for better scalability and organization.

## 📁 Project Structure

```text
fullstack-project/
│
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── models/         # Database schemas (Mongoose)
│   │   ├── controllers/    # Business logic (Express functions)
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helper functions (Emails, etc.)
│   │   └── app.js          # Express setup
│   ├── server.js           # Server entry point
│   └── package.json
│
├── frontend/               # React + Vite UI
│   ├── src/
│   │   ├── components/     # Reusable UI elements
│   │   ├── pages/          # Full page layouts
│   │   ├── context/        # Global state management
│   │   ├── App.jsx         # Main routing
│   │   └── main.jsx        # Entry point
│   └── package.json
│
└── README.md
```

## 🧠 Core Philosophy
- **Frontend asks**: Uses `fetch` or `axios` to request data from the API.
- **Backend thinks**: Validates data, runs business logic, and interacts with the database.
- **Database remembers**: Stores users, orders, and products permanently.

## 🚀 How to Run Locally

### 1. Setup Backend
```bash
cd backend
npm install
npm start
```
*Make sure your `.env` file is configured with `MONGODB_URI`, `CLOUDINARY_*`, `BREVO_API_KEY`, etc.*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🛠 Tech Stack
- **Frontend**: React, Vite, Framer Motion, i18next (Internationalization)
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary (Image storage)
- **Email**: Brevo API / Nodemailer (Fallback)
