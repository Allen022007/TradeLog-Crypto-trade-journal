# TradeLog - Crypto Trading Journal 🚀

TradeLog is a full-stack web application designed for cryptocurrency traders to log, track, and manage their positions securely. Built with the **MERN Stack** (MongoDB, Express, React/Next.js, Node.js), it features secure authentication, protected routes, and a responsive dashboard.

## 📋 Features

### ✅ Core Functionality
* **User Authentication:** Secure Signup/Login using **JWT (JSON Web Tokens)** and **Bcrypt** for password hashing.
* **Trade Management (CRUD):** Users can Log (Create), View (Read), and Delete trades.
* **Dashboard:** Real-time overview of current positions with status indicators (Open/Closed).
* **Search & Filter:** Filter trades by status or search by coin symbol (e.g., BTC, ETH).

### 🛡️ Security & Architecture
* **Protected Routes:** Dashboard is inaccessible without a valid session token.
* **Secure Backend:** Implements Helmet for header security and CORS policies.
* **Logging:** Server-side request logging for monitoring and debugging.

## 🛠️ Tech Stack

* **Frontend:** Next.js 16 (App Router), Tailwind CSS, Axios.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Cloud).
* **Tools:** Postman (API Testing), Git (Version Control).

## 📂 Project Structure

This repository contains two main directories:
* `tradelog-frontend/`: The Next.js client application.
* `tradelog-backend/`: The Node.js/Express server API.

## 🚀 Scalability Strategy

I have designed this application with future growth in mind. For a detailed breakdown of how I would transition this MVP into a production-grade, high-frequency trading platform (including Microservices, Redis Caching, and Database Sharding), please refer to the **[SCALABILITY.md](./SCALABILITY.md)** file included in this repository.

## ⚙️ Getting Started (Run Locally)

### 1. Backend Setup
```bash
cd tradelog-backend
npm install
# Create a .env file with PORT, MONGO_URI, and JWT_SECRET
npm run start
```

### 2. Frontend Setup

```
cd tradelog-frontend
npm install
npm run dev
```
Open http://localhost:3000 to view the application.
